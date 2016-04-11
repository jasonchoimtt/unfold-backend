import { NotFoundError, BadRequestError } from '../../errors';
import { Event } from '../../models';
import { Twitter as StreamScraper } from './twitter';


let running = {};

export const StreamDaemon = {
    async start(id) {
        let event = await Event.findById(id);
        if (!event)
            throw new NotFoundError();

        let sources = await event.getSources();
        let twitter = sources.find(x => x.type === 'twitter');

        if (!twitter) {
            throw new BadRequestError('sources not configured');

        } else if (running[event.id]) {
            return false;

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
            return true;
        }
    },

    async stop(id) {
        let event = await Event.findById(id);
        if (!event)
            throw new NotFoundError();

        if (!running[event.id]) {
            return false;

        } else {
            running[event.id].stop();
            return true;
        }
    },
};
