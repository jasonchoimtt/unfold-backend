import express from 'express';

import { parseJSON, catchError } from '../utils';
import { BadRequestError } from '../errors';
import * as auth from '../auth';


export const router = express.Router();

router.post('/', parseJSON, catchError(async function(req, res) {
    let data = req.body.data || {};
    if (data.username && data.password) {
        let { token, exp } = await auth.authenticate(data.username, data.password);
        res.json({ token, exp });
    } else if (data.token) {
        let { token, exp } = await auth.renew(data.token);
        res.json({ token, exp });
    } else {
        throw new BadRequestError();
    }
}));
