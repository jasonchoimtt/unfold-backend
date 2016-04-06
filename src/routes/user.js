import express from 'express';
import Joi from 'joi';
import { UniqueConstraintError } from 'sequelize';
import _ from 'lodash';

import { parseJSON, catchError, validateOrThrow } from '../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import { requireLogin } from '../auth';
import { User } from '../models';


export const router = express.Router();

const requiredFields = ['name'];

const querySchema = Joi.object({
    q: Joi.string().regex(/^[A-Za-z][A-Za-z0-9_]+$/, 'required').default(''),
}).required();

const updateSchema = Joi.object({
    name: Joi.string().min(1).max(255),
    profile: {
        description: Joi.string(),
    },
}).required();

const creationSchema = updateSchema.keys({
    id: Joi.string().regex(/^[A-Za-z][A-Za-z0-9_]{4,31}$/, 'required').required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
    dateOfBirth: Joi.date().iso().required(), // TODO: timezone issues
}).requiredKeys(requiredFields);

router.get('/', catchError(async function(req, res) {
    let query = validateOrThrow(req.query, querySchema);

    let users = await User.findAll({
        where: {
            id: { $iLike: `${query.q.replace(/_/g, '\\_')}%` },
        },
    });

    users = users.map(u => u.get({ plain: true, attributeSet: 'brief' }));
    res.json(users);
}));

/**
 * Registration endpoint
 */
router.post('/', parseJSON, catchError(async function(req, res) {
    if (req.session)
        throw new BadRequestError('user already authenticated');

    let data = validateOrThrow(req.body, creationSchema);

    let user;
    try {
        user = User.build(data);
        await user.setPassword(req.body.password);
        await user.save();
    } catch (err) {
        if (err instanceof UniqueConstraintError &&
                err.errors.some(x => x.path.indexOf('id') !== -1))
            throw new BadRequestError(`the "id" ${user.id} is already taken`);
        else
            throw err;
    }

    res.status(201).json(user);
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
        throw new UnauthorizedError('only current user can edit their profile');

    let data = validateOrThrow(req.body, updateSchema);
    _.defaults(data.profile, user.profile);

    user = await user.update(data);

    let privateAccess = req.session && req.session.user.id === user.id;

    res.json(user.get({
        plain: true,
        attributeSet: privateAccess ? 'private' : null,
    }));
}));
