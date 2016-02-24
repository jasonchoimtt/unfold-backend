import express from 'express';

import { parseJSON, catchError } from '../utils';
import { BadRequestError } from '../errors';
import * as auth from '../auth';


export const router = express.Router();

router.post('/', parseJSON, catchError(async function(req, res) {
    if (req.body.username && req.body.password) {
        let { token, exp } = await auth.authenticate(req.body.username, req.body.password);
        res.json({ token, exp });
    } else if (req.body.token) {
        let { token, exp } = await auth.renew(req.body.token);
        res.json({ token, exp });
    } else {
        throw new BadRequestError();
    }
}));
