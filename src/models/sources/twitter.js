import Joi from 'joi';


export const source = {
    type: 'twitter',

    schema: Joi.object({
        users: Joi.array().items(
            Joi.string().replace(/^@/, '').regex(/^\S+$/, 'required') // TODO: no commas
        ).default([]),

        hashtags: Joi.array().items(
            Joi.string().replace(/^#/, '').regex(/^\S+$/, 'required')
        ).default([]),
    }),

    meta: {
        name: 'Twitter',
    },
};
