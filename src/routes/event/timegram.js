import express from 'express';
import _ from 'lodash';
import { fn, col, literal } from 'sequelize';

import { catchError } from '../../utils';
import { BadRequestError, NotFoundError } from '../../errors';
import { Event } from '../../models';


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
