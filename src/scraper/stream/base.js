import EventEmitter from 'events';
import { Event } from '../../models';


export class ScraperDaemon extends EventEmitter {
    constructor(eventId, config) {
        super();
        this.config = config;
        this.eventId = eventId;
        this.event = null;
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
            .catch(this.emit.bind(this, 'error')); // async

        return this;
    }

    async run() {
    }

    stop() {
        return this;
    }
}
