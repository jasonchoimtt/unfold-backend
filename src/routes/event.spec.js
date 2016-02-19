import _ from 'lodash';
import { request, createTestUser } from '../spec-utils';
import { Event } from '../models';


function withCreateEvent(callback) {
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

function withCreatePosts(input) {
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
                data: { link: 'http://www.example.com/' },
                createdAt: new Date(2014, 9, 26, 20),
            },
            {
                data: { link: 'https://developer.mozilla.org/' },
                createdAt: new Date(2014, 9, 26, 21),
            },
        ].map(x => event.createPost(x)));
    });
}


describe('Event info endpoint', function() {
    let user, requestAuth, event;

    withCreateEvent(vars => ({ user, requestAuth, event } = vars));

    it('delivers a brief list of events with basic information', async function() {
        let { data } = await request.get('/api/event/');
        expect(data.data).to.include.something
                .with.property('title', 'Test Event');
        expect(data.data).to.all.not.have.keys('roles', 'description');
    });

    it('delivers an event with information and roles', async function() {
        let { data } = await request.get(`/api/event/${event.id}`);
        expect(data.data.title).to.equal('Test Event');
        expect(data.data.roles[0].type).to.equal('OWNER');
        expect(data.data.roles[0].user).to.have.property('id', 'test_user');
        expect(data.data.roles[0].user).not.to.have.property('password');
    });

    it('creates a new event with an owner role', async function() {
        let { data } = await requestAuth.post(`/api/event/`, {
            data: {
                title: 'A New Event',
                location: 'Mars',
            },
        });

        ({ data } = await request.get(`/api/event/${data.data.id}`));
        expect(data.data.title).to.equal('A New Event');
        expect(data.data.roles).to.have.length(1);
        expect(data.data.roles[0]).to.have.deep.property('user.id', user.id);
    });

    it('updates the event information', async function() {
        await requestAuth.put(`/api/event/${event.id}`, {
            data: {
                tags: ['Hong Kong', 'Social'],
                description: 'Lorem ipsum',
                startedAt: new Date(2014, 9, 26),
                endedAt: new Date(2015, 9, 26),
                timezone: 8,
                language: 'zh-hk',
            },
        });
        let { data } = await request.get(`/api/event/${event.id}`);

        let evt = data.data;
        expect(evt.tags).to.deep.equal(['Hong Kong', 'Social']);
        expect(evt.description).to.equal('Lorem ipsum');
        expect(new Date(evt.startedAt).getTime()).to.equal(new Date(2014, 9, 26).getTime());
        expect(new Date(evt.endedAt).getTime()).to.equal(new Date(2015, 9, 26).getTime());
        expect(evt.timezone).to.equal(8);
        expect(evt.language).to.equal('zh-hk');
    });

    it('requires authentication to create and change events', async function() {
        await (async () => {
            try {
                await request.post(`/api/event/`, {
                    data: {
                        title: 'A New Event',
                        location: 'Mars',
                    },
                });
            } catch (err) {
                expect(err.status).to.equal(401);
                return;
            }
            throw new Error('error not thrown');
        })();
        await (async () => {
            try {
                await request.put(`/api/event/${event.id}`, {
                    data: {
                        tags: ['Hong Kong', 'Social'],
                    },
                });
            } catch (err) {
                expect(err.status).to.equal(401);
                return;
            }
            throw new Error('error not thrown');
        })();
    });
});


describe('Timeline endpoint', function() {
    let requestAuth, event;

    withCreateEvent(vars => ({ requestAuth, event } = vars));
    withCreatePosts(() => ({ event }));

    it('delivers recent posts by default', async function() {
        let { data } = await request.get(`/api/event/${event.id}/timeline`);

        expect(data.data).to.have.length(3);
        expect(data.data).to.deep.equal(
                _.sortBy(data.data, x => new Date(x.createdAt).getTime() * -1));

        expect(data.data).to.all.not.have.key('dataAuthor');
    });

    it('delivers posts in the specified period', async function() {
        let { data } = await request.get(`/api/event/${event.id}/timeline`, {
            params: {
                begin: new Date(2014, 9, 26, 18),
                end: new Date(2014, 9, 26, 20),
            },
        });

        expect(data.data).to.have.length(1);
        expect(data.data).to.all.satisfy(
                x => new Date(x.createdAt).getTime() === new Date(2014, 9, 26, 19).getTime());
    });

    it('creates a new self post', async function() {
        await requestAuth.post(`/api/event/${event.id}/timeline`, {
            data: {
                caption: 'I like self posts!',
            },
        });

        let { data } = await request.get(`/api/event/${event.id}/timeline`);

        expect(data.data[0]).to.have.property('caption', 'I like self posts!');
        expect(data.data[0]).to.have.property('data').that.is.null; // eslint-disable-line
    });

    it('creates a new link post', async function() {
        await requestAuth.post(`/api/event/${event.id}/timeline`, {
            data: {
                caption: 'A link',
                data: { link: 'http://www.example.com/' },
            },
        });

        let { data } = await request.get(`/api/event/${event.id}/timeline`);

        expect(data.data[0]).to.have.property('caption', 'A link');
        expect(data.data[0]).to.have.property('data')
            .that.has.property('link', 'http://www.example.com/');
    });

    it('requires authentication to create posts', async function() {
        try {
            await request.post(`/api/event/${event.id}/timeline`, {
                data: {
                    caption: 'I like self posts!',
                },
            });
        } catch (err) {
            expect(err.status).to.equal(401);
            return;
        }
        throw new Error('error not thrown');
    });

    it('rejects creating an empty post', async function() {
        try {
            await requestAuth.post(`/api/event/${event.id}/timeline`, { data: {} });
        } catch (err) {
            expect(err.status).to.equal(400);
            return;
        }
        throw new Error('error not thrown');
    });
});


describe('Timegram endpoint', function() {
    let event;

    withCreateEvent(vars => ({ event } = vars));
    withCreatePosts(() => ({ event }));

    it('delivers an overview timegram by default', async function() {
        let { data } = await request.get(`/api/event/${event.id}/timegram`);

        expect(data.data).to.have.length(9);
        expect(data.span).to.have.property('resolution', 86400);
        expect(data.data[2]).to.have.property('frequency', 3);
    });

    it('delivers a timegram in the specified period and resolution', async function() {
        let { data } = await request.get(`/api/event/${event.id}/timegram`, {
            params: {
                begin: new Date(2014, 9, 26, 0),
                end: new Date(2014, 9, 27, 0),
                resolution: 3600,
            },
        });

        expect(data.data).to.have.length(24);
        [19, 20, 21].map(hour => {
            expect(data.data[23 - hour]).to.have.property('frequency', 1);
        });
    });
});
