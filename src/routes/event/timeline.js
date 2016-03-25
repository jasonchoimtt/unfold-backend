import express from 'express';
import _ from 'lodash';
import { ValidationError } from 'sequelize';

import { parseJSON, catchError } from '../../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import { requireLogin } from '../../auth';
import { User, Event, Role } from '../../models';
import { ScrapLink } from '../../scraper/jobs';


export const router = express.Router();

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
        include: [{ model: User, as: 'author' }],
    });
    res.json({ posts: data });
}));

router.post('/:id/timeline', requireLogin, parseJSON, catchError(async function(req, res) {
    let role = await Event.build({ id: req.params.id }, { isNewRecord: false })
                .hasUserWithRole(req.session.user.id, [Role.OWNER, Role.CONTRIBUTOR]);
    if (!role)
        throw new UnauthorizedError();

    let data = _.pick(req.body, 'caption', 'data', 'tags');
    data.data = data.data && _.pick(data.data, 'url');
    data.authorId = req.session.user.id;

    let post;
    try {
        post = await Event.build({ id: req.params.id }, { isNewRecord: false }).createPost(data);
        post = await post.reload({
            include: [{ model: User, as: 'author' }],
        });
    } catch (err) {
        if (err instanceof ValidationError)
            throw new BadRequestError();
        else
            throw err;
    }
    res.status(201).json(post);

    if (data.data && data.data.url) {
        ScrapLink({
            url: data.data.url,
            postId: post.id,
        }).save(); // async
    }
}));
