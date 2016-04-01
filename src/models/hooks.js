/**
 * Hooks for implementing the event stream.
 */
import { Publisher, Channels } from '../structs/stream';
import { catchToLog } from '../utils';

import { Post } from './post';
import { User } from './user';


const publishToStream = catchToLog('hooks-publish-stream')(
    async function publishToStream(type, instance) {
        if (!instance.eventId || typeof instance.author === 'undefined') {
            await instance.reload({
                include: [{ model: User, as: 'author' }],
            });
        }

        await Publisher.publish(Channels.event(instance.eventId), JSON.stringify({
            resource: 'post',
            type: type,
            data: instance,
        }));
    }
);

Post.addHook('afterCreate', 'publishToStream', publishToStream.bind(null, 'created'));
Post.addHook('afterUpdate', 'publishToStream', publishToStream.bind(null, 'updated'));
