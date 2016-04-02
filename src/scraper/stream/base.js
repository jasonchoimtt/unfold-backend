import EventEmitter from 'events';
import { Event } from '../../models';
import { logger } from '../../utils';


export class ScraperDaemon extends EventEmitter {
    constructor(eventId, config) {
        super();
        this.config = config;
        this.eventId = eventId;
        this.event = null;

        this.TAG = `scraper-stream-${this.constructor.name.toLowerCase()}-${this.eventId}`;
    }

    start() {
        Event.findById(this.eventId)
            .then(event => {
                if (!event)
                    throw new Error(`event with id ${this.eventId} does not exist`);
                this.event = event;

                let promise = this.run();
                if (promise)
                    promise.then(this.emit.bind(this, 'close'));

                return promise;
            })
            .catch(err => {
                this.emit('error', err);
                logger.error(this.TAG, err);
            }); // async

        return this;
    }

    async run() {
    }

    stop() {
        return this;
    }
}
