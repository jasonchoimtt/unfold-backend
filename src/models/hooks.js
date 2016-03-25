/**
 * Hooks for implementing the event stream.
 */
import assert from 'assert';
import { Publisher, Channels } from '../stream';

import { Post } from './post';


/**
 * Removes return value of decorated function so that the function does not
 * return (presumably) a promise.
 */
function noWait(asyncFn) {
    return function(...args) {
        asyncFn(...args);
    };
}

Post.addHook('afterCreate', 'publishToStream', noWait(async instance => {
    if (!instance.eventId)
        await instance.reload();

    let event = instance.eventId;
    assert(event);

    await Publisher.publish(Channels.event(event), JSON.stringify({
        resource: 'post',
        type: 'created',
        data: instance,
    }));
}));

Post.addHook('afterUpdate', 'publishToStream', noWait(async instance => {
    if (!instance.eventId)
        await instance.reload();

    let event = instance.eventId;
    assert(event);

    await Publisher.publish(Channels.event(event), JSON.stringify({
        resource: 'post',
        type: 'updated',
        data: instance,
    }));
}));
