import express from 'express';
import _ from 'lodash';
import { ValidationError, fn, col, literal } from 'sequelize';

import { parseJSON, catchError } from '../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors';
import { requireLogin } from '../auth';
import { Event, Role } from '../models';


/**
 * Parses an input date into UNIX timestamp, or the default value if it is null.
 *
 * Throws if the date format is invalid.
 *
 * @param {String} date a String date in UNIX timestamp or ISO 8601
 * @param {Number} [defaultValue] the default value to use if date is null
 * @param {Object} [options]
 * @param {Boolean} [options.force] use default value even if date is invalid
 */
function parseDate(date, defaultValue = null, options = {}) {
    if (typeof date === 'undefined' || date === null)
        return defaultValue;

    if (/^\d+$/.exec(date.trim()))
        date = parseInt(date, 10) * 1000;
    let ret = new Date(date).getTime();
    if (isNaN(ret)) {
        if (options.force)
            return defaultValue;
        else
            throw new BadRequestError();
    }
    return Math.floor(ret / 1000);
}

function dateOf(timestamp) {
    return new Date(timestamp * 1000);
}

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

/*
 * Timeline endpoint
 */
router.get('/:id/timeline', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    let where = {};
    let begin = new Date(req.query.begin);
    let end = new Date(req.query.end);
    if (!isNaN(end.getTime())) {
        where.createdAt = where.createdAt || {};
        where.createdAt.$lt = end;
    }
    if (!isNaN(begin.getTime())) {
        where.createdAt = where.createdAt || {};
        where.createdAt.$gte = begin;
    }

    let data = await event.getPosts({
        where: where,
        limit: 100,
        order: [
            ['createdAt', 'DESC'],
        ],
    });
    res.json({
        data: data,
    });
}));

router.post('/:id/timeline', requireLogin, parseJSON, catchError(async function(req, res) {
    let role = await Event.build({ id: req.params.id })
                .hasUserWithRole(req.session.user.id, [Role.OWNER, Role.CONTRIBUTOR]);
    if (!role)
        throw new UnauthorizedError();

    let data = _.pick(req.body.data, 'caption', 'data');
    data.data = data.data && _.pick(data.data, 'link');

    let post;
    try {
        post = await Event.build({ id: req.params.id }).createPost(data);
    } catch (err) {
        if (err instanceof ValidationError)
            throw new BadRequestError();
        else
            throw err;
    }
    res.json({
        data: post,
    });
}));

/*
 * Timegram endpoint
 */
router.get('/:id/timegram', catchError(async function(req, res) {
    const MIN_RESOLUTION = 3600;
    const DEFAULT_RESOLUTION = 86400;

    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    let begin = parseDate(req.query.begin, event.startedAt.getTime() / 1000);
    let end = parseDate(req.query.end,
                        (event.endedAt ? event.endedAt.getTime() : Date.now()) / 1000);

    let resolution = parseInt(req.query.resolution, 10);
    if (isNaN(resolution))
        resolution = DEFAULT_RESOLUTION;
    if (resolution < MIN_RESOLUTION)
        // TODO: make an error message
        resolution = DEFAULT_RESOLUTION;

    let endBound = Math.ceil((end - begin) / resolution) * resolution + begin;

    let count = (endBound - begin) / resolution;

    let frequencies = await event.getPosts({
        attributes: [
            [fn('WIDTH_BUCKET', literal('EXTRACT(EPOCH FROM "createdAt")'),
                begin, endBound, count), 'bucket'],
            [fn('COUNT', col('*')), 'frequency'],
        ],
        where: {
            createdAt: { $gte: dateOf(begin), $lt: dateOf(end) },
        },
        group: [col('bucket')],
        order: [
            [col('bucket'), 'DESC'],
        ],
    });
    // Post objects do not have frequency and bucket getters =(
    frequencies = frequencies.map(x => x.toJSON());

    let histogram = _.range(count).map(bucket => ({
        begin: dateOf(begin + resolution * bucket),
        end: dateOf(Math.min(begin + resolution * (bucket + 1), end)),
        frequency: 0,
    }));
    frequencies.forEach(record => { // bucket from Postgres is 1-based
        histogram[record.bucket - 1].frequency = parseInt(record.frequency, 10);
    });
    histogram.reverse();

    return res.json({
        data: histogram,
        span: {
            begin: dateOf(begin),
            end: dateOf(end),
            resolution,
        },
    });
}));
