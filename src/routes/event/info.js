import express from 'express';
import _ from 'lodash';
import { ValidationError } from 'sequelize';

import { parseJSON, catchError } from '../../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import { requireLogin } from '../../auth';
import { Event, Role, User } from '../../models';


export const router = express.Router();

/*
 * Event info endpoint
 */
router.get('/', catchError(async function(req, res) {
    let events = await Event.scope('brief').findAll();
    res.json(events);
}));

router.post('/', requireLogin, parseJSON, catchError(async function(req, res) {
    let data = _.pick(req.body, 'title', 'location', 'tags', 'description',
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
    res.status(201).json(event);
}));

router.get('/:id', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    res.json(event);
}));

router.put('/:id', requireLogin, parseJSON, catchError(async function(req, res) {
    let role = await Event.build({ id: req.params.id })
                .hasUserWithRole(req.session.user.id, [Role.OWNER, Role.CONTRIBUTOR]);
    if (!role)
        throw new UnauthorizedError();

    let data = _.pick(req.body, 'title', 'location', 'tags', 'description',
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
    res.json(event);
}));

router.get('/:id/roles', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    let roles = await event.getRoles({
        include: [User],
    });
    res.json(roles);
}));

router.patch('/:id/roles', requireLogin, parseJSON, catchError(async function(req, res) {
    if (!await Event.build({ id: req.params.id })
            .hasUserWithRole(req.session.user.id, Role.OWNER))
        throw new UnauthorizedError();

    if (!Array.isArray(req.body))
        throw new BadRequestError();
    try {
        await Promise.all(req.body.map(role => {
            if (role.type === null) {
                return Role.destroy({
                    where: {
                        userId: role.userId,
                        eventId: req.params.id,
                    },
                });
            } else {
                // Keep curly brace to avoid hitting babel bug
                return Role.upsert({
                    userId: role.userId,
                    eventId: req.params.id,
                    type: role.type,
                });
            }
        }));
    } catch (err) {
        if (err instanceof ValidationError)
            throw new BadRequestError();
        else
            throw err;
    }

    let roles = await Event.build({ id: req.params.id }).getRoles({
        include: [User],
    });
    res.json(roles);
}));
