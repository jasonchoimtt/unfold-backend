import express from 'express';
import _ from 'lodash';
import Joi from 'joi';

import { parseJSON, catchError, validateOrThrow, logger } from '../../utils';
import { NotFoundError, UnauthorizedError } from '../../errors';
import { requireLogin } from '../../auth';
import { Event, Role, Source, sequelize } from '../../models';
import { StreamDaemon } from '../../scraper/stream';


export const router = express.Router();

const requestBaseSchema = Joi.array().items(
    Joi.object({
        type: Joi.any().valid(_.keys(Source.sources)).required(),
        config: Joi.alternatives().try(Joi.object().unknown(true), null),
    })
).required();

router.get('/:id/sources', requireLogin, catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    if (!await event.hasUserWithRole(req.session.user.id, Role.OWNER))
        throw new UnauthorizedError('only owners can view event sources');

    let sources = await event.getSources();
    res.json(sources);
}));

router.patch('/:id/sources', requireLogin, parseJSON, catchError(async function(req, res) {
    let _event = Event.build({ id: req.params.id }, { isNewRecord: false });

    if (!await _event.hasUserWithRole(req.session.user.id, Role.OWNER))
        throw new UnauthorizedError('only owners can update event sources');

    let data = validateOrThrow(req.body, requestBaseSchema)
        .map(source => {
            if (source.config) {
                let spec = Source.sources[source.type];
                source.config = validateOrThrow(source.config, spec.schema);
            }
            return source;
        });

    await sequelize.transaction(t => {
        return Promise.all(data.map(source => {
            if (source.config === null) {
                return Source.destroy({
                    where: {
                        eventId: req.params.id,
                        type: source.type,
                    },
                }); // ignoring the result
            } else {
                return Source.upsert({
                    eventId: req.params.id,
                    type: source.type,
                    config: source.config,
                }, {
                    transaction: t,
                });
            }
        }));
    });

    let sources = await _event.getSources();
    res.json(sources);

    StreamDaemon.stop(req.params.id)
        .then(() => StreamDaemon.start(req.params.id))
        .catch(logger.error.bind(logger, 'rest')); // async
}));
