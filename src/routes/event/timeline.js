import express from 'express';
import Joi from 'joi';

import { parseJSON, catchError, validateOrThrow } from '../../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import { requireLogin } from '../../auth';
import { User, Event, Role } from '../../models';
import { ScrapLink } from '../../structs/jobs';


export const router = express.Router();

const querySchema = Joi.object({
    begin: Joi.date().iso(),
    end: Joi.date().iso(),
    limit: Joi.number().integer().min(0).max(100).default(100),
});

const creationSchema = Joi.object({
    caption: Joi.string().max(10000),
    data: {
        url: Joi.string().uri({ scheme: ['http', 'https'] }),
    },
    tags: Joi.array().items(Joi.string().trim()),
});

router.get('/:id/timeline', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    let { begin, end, limit } = validateOrThrow(req.query, querySchema, { convert: true });
    let where = {};
    if (begin || end) {
        where.createdAt = {};
        if (end)
            where.createdAt.$lt = end;
        if (begin)
            where.createdAt.$gte = begin;
    }

    let data = await event.getPosts({
        where: where,
        limit: limit,
        order: [
            ['createdAt', 'DESC'],
        ],
        include: [{ model: User, as: 'author' }],
    });
    res.json({ posts: data });
}));

router.post('/:id/timeline', requireLogin, parseJSON, catchError(async function(req, res) {
    let role = await Event.build({ id: req.params.id }, { isNewRecord: false })
                .hasUserWithRole(req.session.user.id, [Role.OWNER, Role.CONTRIBUTOR]);
    if (!role)
        throw new UnauthorizedError();

    let data = validateOrThrow(req.body, creationSchema);
    if (!data.caption && !(data.data && data.data.url))
        throw new BadRequestError('either "caption" or "data.url" must be present');

    data.authorId = req.session.user.id;

    let post = await Event.build({ id: req.params.id }, { isNewRecord: false }).createPost(data);

    post = await post.reload({
        include: [{ model: User, as: 'author' }],
    });
    res.status(201).json(post);

    if (data.data && data.data.url) {
        ScrapLink({
            url: data.data.url,
            postId: post.id,
        }).save(); // async
    }
}));
