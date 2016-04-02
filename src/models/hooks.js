/**
 * Hooks for implementing the event stream.
 */
import { Publisher, Channels } from '../structs/stream';
import { catchToLog } from '../utils';

import { Post } from './post';
import { Tick } from './tick';
import { User } from './user';


const publishToStream = function(resource, type) {
    return catchToLog('hooks-publish-stream')(
        async function publishToStream(instance) {
            if (!instance.eventId ||
                    (resource === 'post' && typeof instance.author === 'undefined')) {
                let options = resource === 'post'
                        ? { include: [{ model: User, as: 'author' }] }
                        : {};
                await instance.reload(options);
            }

            let key = resource === 'post' ? 'event' : 'eventTick';
            await Publisher.publish(Channels[key](instance.eventId), JSON.stringify({
                resource: resource,
                type: type,
                data: instance,
            }));
        }
    );
};

Post.addHook('afterUpdate', 'publishToStream', publishToStream('post', 'updated'));
Post.addHook('afterCreate', 'publishToStream', publishToStream('post', 'created'));

Tick.addHook('afterCreate', 'publishToStream', publishToStream('tick', 'created'));
Tick.addHook('afterUpdate', 'publishToStream', publishToStream('tick', 'updated'));
