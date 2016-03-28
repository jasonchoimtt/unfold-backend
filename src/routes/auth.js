import express from 'express';
import Joi from 'joi';

import { parseJSON, catchError, validateOrThrow } from '../utils';
import * as auth from '../auth';


export const router = express.Router();

const requestSchema = Joi.object({
    username: Joi.string().regex(/^[A-Za-z][A-Za-z0-9_]{4,31}$/, 'required'),
    password: Joi.string().min(8),
    token: Joi.string().min(1),
}).xor('username', 'token').with('username', 'password');

router.post('/', parseJSON, catchError(async function(req, res) {
    let data = validateOrThrow(req.body, requestSchema);

    if (data.username) {
        let { token, exp } = await auth.authenticate(data.username, data.password);
        res.json({ token, exp });

    } else {
        let { token, exp } = await auth.renew(data.token);
        res.json({ token, exp });
    }
}));
