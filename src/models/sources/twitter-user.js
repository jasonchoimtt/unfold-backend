import Joi from 'joi';


export const source = {
    site: 'Twitter',
    type: 'TWITTER_USER',

    schema: Joi.object({
        section: Joi.string().replace(/^@/, '').regex(/^\S+$/, 'required'),
    }),

    isEqual(x, y) {
        return x.schema.toLowerCase() === y.schema.toLowerCase();
    },

    getMeta(config) {
        return {
            name: `@${config.section} on Twitter`,
            url: `https://twitter.com/${config.section}`,
        };
    },
};
