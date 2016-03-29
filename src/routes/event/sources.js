import assert from 'assert';
import express from 'express';
import _ from 'lodash';
import Joi from 'joi';

import { parseJSON, catchError, validateOrThrow } from '../../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import { requireLogin } from '../../auth';
import { Event, Role, Source, sequelize } from '../../models';


export const router = express.Router();

const requestBaseSchema = Joi.array().items(Joi.alternatives().try(
    Joi.object({
        id: Joi.number().integer(),
        type: Joi.any().valid(_.keys(Source.sources)).required(),
        config: Joi.object().unknown(true).required(),
    }),
    Joi.object({
        id: Joi.number().integer().required(),
        type: null,
    })
)).required();

router.get('/:id/sources', requireLogin, catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    if (!await event.hasUserWithRole(req.session.user.id, Role.OWNER))
        throw new UnauthorizedError('only owners can view event sources');

    let sources = (await event.getSources()).map(x => x.mergeConfig());
    res.json(sources);
}));

router.patch('/:id/sources', requireLogin, parseJSON, catchError(async function(req, res) {
    let _event = Event.build({ id: req.params.id }, { isNewRecord: false });

    if (!await _event.hasUserWithRole(req.session.user.id, Role.OWNER))
        throw new UnauthorizedError('only owners can update event sources');

    let data = validateOrThrow(req.body, requestBaseSchema)
        .map(source => {
            if (source.type) {
                let spec = Source.sources[source.type];
                source.config = validateOrThrow(source.config, spec.schema);
            }
            return source;
        });

    await sequelize.transaction(t => {
        return Promise.all(data.map(source => {
            if (typeof source.id === 'number') {
                let options = {
                    where: { id: source.id },
                    transaction: t,
                };

                assert(!('eventId' in source));

                let promise = source.config
                    ? Source.update(_.omit(source, 'id'), options).then(x => x[0])
                    : Source.destroy(options);

                return promise.then(count => {
                    if (count !== 1)
                        throw new BadRequestError(`source with id ${source.id} does not exist`);
                });
            } else {
                return _event.createSource(source, {
                    transaction: t,
                });
            }
        }));
    });

    let sources = (await _event.getSources()).map(x => x.mergeConfig());
    res.json(sources);
}));
