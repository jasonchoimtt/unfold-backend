/**
 * Hooks for implementing the event stream.
 */
import assert from 'assert';
import { Publisher, Channels } from '../stream';

import { Post } from './post';


Post.addHook('afterCreate', 'publishToStream', instance => {
    let event = instance.eventId;
    assert(event);

    Publisher.publish(Channels.event(event), JSON.stringify({
        resource: 'post',
        type: 'created',
        data: instance,
    })); // async
});

Post.addHook('afterUpdate', 'publishToStream', instance => {
    let event = instance.eventId;
    assert(event);

    Publisher.publish(Channels.event(event), JSON.stringify({
        resource: 'post',
        type: 'updated',
        data: instance,
    })); // async
});
