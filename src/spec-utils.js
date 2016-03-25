import axios from 'axios';
import _ from 'lodash';
import { server } from './';
import { User, Event } from './models';


/**
 * Hooks to initiate the test server.
 */
const port = process.env.PORT || 3001;
const ip = process.env.IP || '0.0.0.0';

before(function() {
    return new Promise((resolve, reject) => {
        server.listen(port, ip);
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
        baseURL: `http://${ip}:${port}/`,
    }));
}

/**
 * Axios instance for test server endpoints.
 */
export const request = createAxios();

export async function createTestUser(id = 'test_user') {
    let [user] = await User.findOrCreate({ where: { id: id } });
    await user.setPassword('test_pwd');
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
