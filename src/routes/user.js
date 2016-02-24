import express from 'express';
import { ValidationError } from 'sequelize';
import _ from 'lodash';

import { parseJSON, catchError } from '../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import { requireLogin } from '../auth';
import { User } from '../models';


export const router = express.Router();

/**
 * Registration endpoint
 */
router.post('/', parseJSON, catchError(async function(req, res) {
    if (req.session)
        throw new BadRequestError();

    // We only need to ensure that they are not null;
    // other validations are done by Sequelize
    let fields = ['id', 'password', 'firstName', 'lastName', 'email', 'dateOfBirth'];
    if (fields.some(x => !req.body[x]))
        throw new BadRequestError();

    let user;
    try {
        user = await User.create(_.pick(req.body, fields));
    } catch (err) {
        // TODO: handle username clash gracefully
        if (err instanceof ValidationError)
            throw new BadRequestError();
        else
            throw err;
    }

    res.json(user);
}));

router.get('/:id', catchError(async function(req, res) {
    let user = await User.findById(req.params.id);
    if (!user)
        throw new NotFoundError();

    let privateAccess = req.session && req.session.user.id === user.id;

    res.json(user.get({
        plain: true,
        attributeSet: privateAccess ? 'private' : null,
    }));
}));

router.put('/:id', requireLogin, parseJSON, catchError(async function(req, res) {
    let user = await User.findById(req.params.id);
    if (!user)
        throw new NotFoundError();

    if (req.session.user.id !== user.id)
        throw new UnauthorizedError();

    // Well, proof of concept
    let data = _.pick(req.body, 'firstName', 'lastName');

    try {
        user = await user.update(data);
    } catch (err) {
        if (err instanceof ValidationError)
            throw new BadRequestError();
        else
            throw err;
    }

    res.json(user);
}));
