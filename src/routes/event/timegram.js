import express from 'express';
import _ from 'lodash';
import assert from 'assert';
import Joi from 'joi';
import { fn, col, literal } from 'sequelize';

import { catchError, validateOrThrow } from '../../utils';
import { NotFoundError } from '../../errors';
import { Event } from '../../models';


function dateOf(timestamp) {
    return new Date(timestamp * 1000);
}

function unixOf(date) {
    return Math.floor(date.getTime() / 1000);
}


export const router = express.Router();

const querySchema = Joi.object({
    begin: Joi.date().iso(),
    end: Joi.date().iso(),
    resolution: Joi.number().integer().min(3600).default(86400),
    sparse: Joi.boolean().default(false),
}).required();

router.get('/:id/timegram', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    let { begin, end, resolution, sparse } = validateOrThrow(req.query, querySchema);

    begin = _.max([begin, event.startedAt].filter(x => x));
    end = _.min([end, event.endedAt].filter(x => x)) || new Date();

    // Extend the end time so that the number of buckets is integral
    let unixBegin = unixOf(begin);
    let unixEnd = unixOf(end);
    let unixEndBound = Math.ceil((unixOf(end) - unixBegin) / resolution) * resolution + unixBegin;

    let count = (unixEndBound - unixBegin) / resolution;

    // Return data of at most three years at finest resolution to prevent out of memory
    assert(sparse || count < 24 * 365 * 3);

    let frequencies = await event.getPosts({
        attributes: [
            [fn('WIDTH_BUCKET', literal('EXTRACT(EPOCH FROM "createdAt")'),
                unixBegin, unixEndBound, count), 'bucket'],
            [fn('COUNT', col('*')), 'frequency'],
        ],
        where: {
            createdAt: { $gte: begin, $lt: end },
        },
        group: [col('bucket')],
        order: [
            [col('bucket'), 'DESC'],
        ],
    });
    // Post objects do not have frequency and bucket getters =(
    frequencies = frequencies.map(x => x.toJSON());

    let histogram = [];

    const createEntry = (index, frequency = 0) => ({
        begin: dateOf(unixEndBound - resolution * (index + 1)),
        end: dateOf(Math.min(unixEndBound - resolution * index, unixEnd)),
        frequency: frequency,
    });

    frequencies.forEach(record => {
        let index = count - record.bucket;
        // bucket from Postgres is 1-based
        if (!sparse) {
            while (histogram.length < index)
                histogram.push(createEntry(histogram.length));
        }
        histogram.push(createEntry(index, parseInt(record.frequency, 10)));
    });

    if (!sparse) {
        while (histogram.length < count)
            histogram.push(createEntry(histogram.length));
    }

    return res.json({
        timegram: histogram,
        span: { begin, end, resolution },
    });
}));
