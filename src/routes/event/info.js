import express from 'express';
import _ from 'lodash';
import Joi from 'joi';
import { ValidationError } from 'sequelize';

import { parseJSON, catchError, joiLanguageCode, validateOrThrow } from '../../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import { requireLogin } from '../../auth';
import { Event, Role, User } from '../../models';


export const router = express.Router();

const requiredFields = ['title', 'location'];
const updatableFields = {
    title: Joi.string().min(3).max(255).trim(),
    location: Joi.string().min(2).max(255).trim(),

    tags: Joi.array().items(Joi.string().trim()).unique(),

    description: Joi.string().max(255).trim(),
    information: Joi.string().max(10000).trim(),

    startedAt: Joi.date().iso(),
    endedAt: Joi.alternatives(Joi.date().iso(), Joi.any().valid(null)),
    timezone: Joi.number().min(-12).max(12),
    language: joiLanguageCode().trim().lowercase(),
};

const creationSchema = Joi.object(
    _.mapValues(updatableFields, (v, k) => requiredFields.indexOf(k) !== -1 ? v.required() : v));
const updateSchema = Joi.object(updatableFields);

const roleUpdateSchema = Joi.array().items(Joi.object({
    type: Joi.any().valid(...Role.types, null).required(),
    userId: Joi.string().required(),
}));

/*
 * Event info endpoint
 */
router.get('/', catchError(async function(req, res) {
    let events = await Event.scope('brief').findAll();
    res.json(events);
}));

router.post('/', requireLogin, parseJSON, catchError(async function(req, res) {
    let data = validateOrThrow(req.body, creationSchema);
    data.roles = [{
        userId: req.session.user.id,
        type: Role.OWNER,
    }];

    let event = await Event.create(data, {
        include: [{ model: Role, as: 'roles' }],
    });
    res.status(201).json(event);
}));

router.get('/:id', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    res.json(event);
}));

router.put('/:id', requireLogin, parseJSON, catchError(async function(req, res) {
    let role = await Event.build({ id: req.params.id }, { isNewRecord: false })
                .hasUserWithRole(req.session.user.id, [Role.OWNER, Role.CONTRIBUTOR]);
    if (!role)
        throw new UnauthorizedError();

    let data = validateOrThrow(req.body, updateSchema);

    let event = await Event.update(data, {
        where: { id: req.params.id },
    });
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
    if (!await Event.build({ id: req.params.id }, { isNewRecord: false })
            .hasUserWithRole(req.session.user.id, Role.OWNER))
        throw new UnauthorizedError();

    let data = validateOrThrow(req.body, roleUpdateSchema);

    try {
        await Promise.all(data.map(role => {
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
            throw new BadRequestError(); // TODO: reject invalid id
        else
            throw err;
    }

    let roles = await Event.build({ id: req.params.id }, { isNewRecord: false }).getRoles({
        include: [User],
    });
    res.json(roles);
}));
