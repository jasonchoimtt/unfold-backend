import express from 'express';
import { ValidationError } from 'sequelize';

import { parseJSON, catchError } from '../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import { requireLogin } from '../auth';
import { Event, Role } from '../models';


export const router = express.Router();

router.get('/', catchError(async function(req, res) {
    let events = await Event.findAll();
    res.json({ data: events });
}));

router.post('/', requireLogin, parseJSON, catchError(async function(req, res) {
    let event = Event.build(req.body.data);
    try {
        event = await event.save();
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
    let role = await Role.find({
        where: {
            user_id: req.session.user.id,
            type: { $in: [Role.OWNER, Role.CONTRIBUTOR] },
        },
    });
    if (!role)
        throw new UnauthorizedError();
    let event;
    try {
        event = await Event.update(req.body.data, {
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
