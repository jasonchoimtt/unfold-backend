import axios from 'axios';
import _ from 'lodash';
import { main } from './';
import { Config } from './config';
import { User, Event } from './models';


Config.testMode();

/**
 * Hooks to initiate the test server.
 */
let server;

before(function() {
    return new Promise((resolve, reject) => {
        ({ server } = main({ silent: true }));
        server.on('listening', resolve);
        server.on('error', reject);
    });
});

after(function() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) reject(err);
            else resolve();
        });
    });
});

function createAxios(options) {
    return axios.create(_.defaults(options, {
        baseURL: `http://${Config.ip}:${Config.port}/`,
    }));
}

/**
 * Axios instance for test server endpoints.
 */
export const request = createAxios();

export async function createTestUser(id = 'test_user', options) {
    let [user] = await User.findOrCreate({ where: { id: id } });
    await user.setPassword('test_pwd');
    if (options)
        user.set(options);
    user = await user.save();

    let resp = await request.post('api/auth/', {
        username: id,
        password: 'test_pwd',
    });
    return {
        user,
        token: resp.data.token,
        requestAuth: createAxios({
            headers: {
                'Authorization': resp.data.token,
            },
        }),
    };
}

export function withCreateTestUser(id, callback, options) {
    if (typeof id === 'function') {
        options = callback;
        callback = id;
    }
    if (typeof id !== 'string')
        id = 'test_user';

    let user, requestAuth;
    before(async function() {
        ({ user, requestAuth } = await createTestUser(id, options));
        if (callback)
            callback({ user, requestAuth });
    });

    after(async function() {
        await user.destroy();
    });
}

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
                tags: ['First', 'Second'],
                createdAt: new Date(2014, 9, 26, 19),
            },
            {
                caption: 'Best website ever',
                tags: ['Second'],
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
