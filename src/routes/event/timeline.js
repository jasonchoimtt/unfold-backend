import express from 'express';
import _ from 'lodash';
import Joi from 'joi';

import {
    parseJSON, catchError, validateOrThrow,
    joiLanguageCode, validateLanguageCode } from '../../utils';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../../errors';
import { requireLogin } from '../../auth';
import { User, Event, Role, PostTranslation, sequelize } from '../../models';
import { ScrapLink } from '../../structs/jobs';


export const router = express.Router();

const querySchema = Joi.object({
    begin: Joi.date().iso(),
    end: Joi.date().iso(),
    limit: Joi.number().integer().min(0).max(10000).default(10000),
    language: joiLanguageCode().trim().lowercase(),
}).required();

const creationSchema = Joi.object({
    caption: Joi.string().allow('').max(10000),
    data: {
        url: Joi.string().uri({ scheme: ['http', 'https'] }),
    },
    tags: Joi.array().items(Joi.string().trim()),
}).required();

const updateSchema = Joi.object({
    translations: Joi.object().pattern(/^[A-Za-z0-9-]+$/, Joi.object({
        content: Joi.alternatives(Joi.string(), null),
    }).required()).default({}),
}).required();

router.get('/:id/timeline', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    let { begin, end, limit, language } = validateOrThrow(req.query, querySchema);
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
        include: [
            {
                model: User,
                as: 'author',
            },
            language && {
                model: PostTranslation,
                as: 'translations',
                where: { language },
                required: false, // left outer join
            },
        ].filter(x => x),
    });
    if (language) {
        data.forEach(post => {
            if (!post.translations[language])
                post.translations[language] = null;
        });
    }
    res.json({ posts: data });
}));

router.post('/:id/timeline', requireLogin, parseJSON, catchError(async function(req, res) {
    let _event = Event.build({ id: req.params.id }, { isNewRecord: false });
    let role = await _event.hasUserWithRole(req.session.user.id, [Role.OWNER, Role.CONTRIBUTOR]);
    if (!role)
        throw new UnauthorizedError('only owners and contributors can post to the event');

    // Allow admin to set createdAt, for testing reasons
    let schema = creationSchema;
    if (req.session.user.isAdmin)
        schema = schema.keys({ createdAt: Joi.date().iso() });

    let data = validateOrThrow(req.body, schema);
    if (!data.caption && !(data.data && data.data.url))
        throw new BadRequestError('either "caption" or "data.url" must be present');

    data.authorId = req.session.user.id;

    let post = await _event.createPost(data);

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

router.put('/:id/timeline/:postId', requireLogin, parseJSON, catchError(async function(req, res) {
    let _event = Event.build({ id: req.params.id }, { isNewRecord: false });
    let role = await _event.hasUserWithRole(req.session.user.id,
                                            [Role.OWNER, Role.CONTRIBUTOR, Role.TRANSLATOR]);
    if (!role)
        throw new UnauthorizedError('only owners, contributors and translators can update a post');

    let data = validateOrThrow(req.body, updateSchema);
    data.translations = _.mapKeys(data.translations, (obj, lang) => {
        let cleanLang = validateLanguageCode(lang);
        if (!cleanLang)
            throw BadRequestError(`${cleanLang} is not a valid language code`);
        return cleanLang;
    });

    // Fetch post first to make sure the post indeed belongs to the event
    let post = (await _event.getPosts({
        where: { id: req.params.postId },
    }))[0];
    if (!post)
        throw new NotFoundError();

    if (data.translations) {
        await sequelize.transaction(t => {
            return Promise.all(_.map(data.translations, (obj, lang) => {
                return PostTranslation.upsert({
                    language: lang,
                    content: obj.content,
                    postId: post.id,
                }, {
                    transaction: t,
                });
            }));
        });
    }

    // Get all translations; probably should optimise this with first Post query
    await post.reload({
        include: [
            {
                model: User,
                as: 'author',
            },
            {
                model: PostTranslation,
                as: 'translations',
                required: false, // left outer join
            },
        ],
    });

    res.json(post);
}));
