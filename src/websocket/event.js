import _ from 'lodash';
import { NotFoundError } from '../errors';
import { Event } from '../models';
import { Subscriber, Channels } from '../structs/stream';
import { logger } from '../utils';


/*
 * Real-time stream for event (posts and ticks).
 */
function stream(resource) {
    return async function stream(req, __, next) {
        try {
            let exists = await Event.count({
                where: { id: req.params.id },
            });
            if (!exists)
                throw new NotFoundError();

        } catch (err) {
            next(err);
            return;
        }

        // async

        let conn = req.accept();
        let boundSend = conn.send.bind(conn);

        conn.on('error', err => {
            logger.error(`websocket-${_.kebabCase(resource)}-stream`, err.stack || err);
            // 'close' will also be emitted on 'error'
        });

        conn.on('close', () => {
            Subscriber.unsubscribe(Channels[resource](req.params.id), boundSend);
        });

        Subscriber.subscribe(Channels[resource](req.params.id), boundSend); // async
    };
}

export const eventStream = stream('event');
eventStream.pattern = '/event/:id';

// TODO: require authentication for tick stream
export const eventTickStream = stream('eventTick');
eventTickStream.pattern = '/event/:id/ticks';
