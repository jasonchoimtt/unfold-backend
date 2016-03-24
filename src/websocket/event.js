import { NotFoundError } from '../errors';
import { Event } from '../models';
import { Subscriber, Channels } from '../stream';


/*
 * Real-time stream for event.
 */
export async function eventStream(req, __, next) {
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
        console.error(err.stack || err);
        // 'close' will also be emitted on 'error'
    });

    conn.on('close', () => {
        Subscriber.unsubscribe(Channels.event(req.params.id), boundSend);
    });

    Subscriber.subscribe(Channels.event(req.params.id), boundSend); // async
}

eventStream.pattern = '/event/:id';
