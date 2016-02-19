import express from 'express';
import _ from 'lodash';
import { ValidationError } from 'sequelize';

import { parseJSON, catchError } from '../../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import { requireLogin } from '../../auth';
import { Event, Role } from '../../models';


export const router = express.Router();

/*
 * Event info endpoint
 */
router.get('/', catchError(async function(req, res) {
    let events = await Event.scope('brief').findAll();
    res.json({ data: events });
}));

router.post('/', requireLogin, parseJSON, catchError(async function(req, res) {
    let data = _.pick(req.body.data, 'title', 'location', 'tags', 'description',
                      'startedAt', 'endedAt', 'timezone', 'language');
    data.roles = [{
        userId: req.session.user.id,
        type: Role.OWNER,
    }];

    let event;
    try {
        event = await Event.create(data, {
            include: [{ model: Role, as: 'roles' }],
        });
    } catch (err) {
        if (err instanceof ValidationError)
            throw new BadRequestError();
        else
            throw err;
    }
    res.json({
        data: event,
        url: event.getURL(),
    });
}));

router.get('/:id', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    res.json({
        data: event,
    });
}));

router.put('/:id', requireLogin, parseJSON, catchError(async function(req, res) {
    let role = await Event.build({ id: req.params.id })
                .hasUserWithRole(req.session.user.id, [Role.OWNER, Role.CONTRIBUTOR]);
    if (!role)
        throw new UnauthorizedError();

    let data = _.pick(req.body.data, 'title', 'location', 'tags', 'description',
                      'startedAt', 'endedAt', 'timezone', 'language');

    let event;
    try {
        event = await Event.update(data, {
            where: { id: req.params.id },
        });
    } catch (err) {
        if (err instanceof ValidationError)
            throw new BadRequestError();
        else
            throw err;
    }
    res.json({
        data: event,
    });
}));
