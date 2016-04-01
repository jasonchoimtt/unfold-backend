import path from 'path';
import _read from 'read';
import axios from 'axios';
import _ from 'lodash';
import { fromCallback } from '../utils';


const read = fromCallback(_read);

export const deflateEvent = {
    async run(argv) {
        let { username, password, host, file, limit, suffix } = argv;

        console.log(`Deflating event for host ${host} from ${file}`);

        if (!username)
            username = await read({ prompt: 'Username: ' });
        if (!password)
            password = await read({ prompt: 'Password: ', silent: true });

        const client = axios.create({ baseURL: host });

        const getTokenFor = async target => {
            return (await client.post('auth', {
                username,
                password,
                masquerade: target,
            })).data.token;
        };

        const auth = role => ({
            headers: { 'Authorization': role.token },
        });

        let { event, posts } = require(path.resolve(file));
        let { roles } = event;

        // Create and login to users
        await Promise.all(roles.map((role, i) => {
            role.username = _.snakeCase(role.name) + suffix;

            return client.post('user', {
                id: role.username,
                password: 'test_pwd',
                name: role.name,
                profile: { description: role.description },
                email: 'test@unfold.online',
                dateOfBirth: new Date(2000, 0, 1),
            })
                .then(() => getTokenFor(role.username))
                .then(token => { roles[i].token = token; });
        }));
        let owner = _.find(roles, x => x.type === 'OWNER');

        // Create event
        let eventId = (await client.post(
            'event',
            _.pick(event, 'title', 'description', 'location', 'startedAt', 'endedAt', 'timezone'),
            auth(owner)
        )).data.id;

        console.log(`Event: ${host}/event/${eventId}`);

        // Create roles
        await client.patch(
            `event/${eventId}/roles`,
            roles.map(role => ({
                userId: role.username,
                type: role.type,
            })),
            auth(owner)
        );

        // Create posts
        let count = 0;
        for (let post of posts) {
            await client.post(
                `event/${eventId}/timeline`,
                _.pick(post, 'caption', 'createdAt', 'tags', 'data'),
                auth(_.find(roles, x => x.id === post.contributor))
            );
            count += 1;
            console.log(`Created post #${count}: ${(post.caption || '').substr(0, 40)}...`);
            if (count > limit)
                break;
        }
        console.log('All done.');
    },

    register(yargs) {
        return yargs.command('deflateEvent <file>', 'Load an event fixture', yargs => {
            return yargs
                .help('help').alias('help', 'h')
                .env('UNFOLD')
                .option('host', {
                    alias: 'H',
                    nargs: 1,
                    describe: 'Target endpoint',
                    default: 'http://localhost:3000/api',
                })
                .option('username', {
                    alias: 'u',
                    nargs: 1,
                    describe: 'Username of an admin account',
                })
                .option('password', {
                    alias: 'p',
                    nargs: 1,
                    describe: 'Password of an admin account',
                })
                .option('limit', {
                    alias: 'l',
                    nargs: 1,
                    type: 'number',
                    describe: 'Maximum number of posts to create',
                    default: 1 / 0,
                })
                .option('suffix', {
                    alias: 's',
                    nargs: 1,
                    describe: 'The suffix for users created',
                    default: () => `_${Math.floor(Math.random() * 1000)}`,
                    defaultDescription: '_{random integer}',
                });
        });
    },
};
