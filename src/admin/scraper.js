import express from 'express';

import { NotFoundError } from '../errors';
import { catchError } from '../utils';
import { Event } from '../models';
import { Twitter as StreamScraper } from '../scraper/stream/twitter';


export const router = express.Router();

let running = {};

router.get('/:id/start', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    let sources = await event.getSources();
    let twitter = sources.find(x => x.type === 'twitter');

    if (!twitter) {
        res.send('sources not configured');

    } else if (running[event.id]) {
        res.send('scraper already running');

    } else {
        let scraper = new StreamScraper(event.id, twitter.config);
        let cleanup = () => { delete running[event.id]; };
        scraper.start()
            .on('close', cleanup)
            .on('error', cleanup);
        running[event.id] = scraper;

        setTimeout(() => {
            if (event.id in running)
                running[event.id].stop();
        }, 3600000);
        res.send('ok');
    }
}));

router.get('/:id/stop', catchError(async function(req, res) {
    let event = await Event.findById(req.params.id);
    if (!event)
        throw new NotFoundError();

    if (!running[event.id]) {
        res.send('scraper not running');

    } else {
        running[event.id].stop();
        res.send('ok');
    }
}));
