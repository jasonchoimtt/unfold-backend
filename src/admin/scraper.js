import express from 'express';

import { catchError } from '../utils';
import { StreamDaemon } from '../scraper/stream';


export const router = express.Router();

router.get('/:id/start', catchError(async function(req, res) {
    let ret = await StreamDaemon.start(req.params.id);

    if (ret)
        res.send('ok');
    else
        res.send('scraper already running');
}));

router.get('/:id/stop', catchError(async function(req, res) {
    let ret = await StreamDaemon.stop(req.params.id);

    if (ret)
        res.send('ok');
    else
        res.send('scraper not running');
}));
