import { Event } from '../../models';
import { createTestUser } from '../../spec-utils';


export function withCreateEvent(callback) {
    let user, requestAuth, event;
    before(async function() {
        ({ user, requestAuth } = await createTestUser());

        event = await Event.create({
            title: 'Test Event',
            location: 'Hong Kong',
        });
        await event.createRole({
            userId: user.id,
        });

        if (callback)
            callback({ user, requestAuth, event });
    });

    after(async function() {
        await Promise.all([event.destroy(), user.destroy()]);
    });
}

export function withCreatePosts(input) {
    before(async function() {
        let { event } = input();
        await event.update({
            startedAt: new Date(2014, 9, 20),
            endedAt: new Date(2014, 9, 29),
        });
        // NOTE: Post.bulkCreate disallows setting createdAt for some reason
        await Promise.all([
            {
                caption: 'Hello, World!',
                createdAt: new Date(2014, 9, 26, 19),
            },
            {
                caption: 'Best website ever',
                data: { url: 'http://www.example.com/' },
                createdAt: new Date(2014, 9, 26, 20),
            },
            {
                data: { url: 'https://developer.mozilla.org/' },
                createdAt: new Date(2014, 9, 26, 21),
            },
        ].map(x => event.createPost(x)));
    });
}
