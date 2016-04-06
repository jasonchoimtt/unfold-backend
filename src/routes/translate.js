import express from 'express';
import Joi from 'joi';

import { parseJSON, catchError, validateOrThrow, joiLanguageCode } from '../utils';
import { requireLogin } from '../auth';
import { translate } from '../services/ms-translator';


export const router = express.Router();

const requestSchema = Joi.object({
    from: Joi.alternatives(joiLanguageCode().trim().lowercase(), null).default(null),
    to: joiLanguageCode().trim().lowercase().required(),
    content: Joi.string().max(10000).required(),
}).required();

router.post('/', requireLogin, parseJSON, catchError(async function(req, res) {
    let data = validateOrThrow(req.body, requestSchema);

    let result = await translate(data.content, {
        from: data.from,
        to: data.to,
        contentType: 'text/html',
    });

    res.json(result);
}));
