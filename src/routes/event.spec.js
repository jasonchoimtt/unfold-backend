import { request, createTestUser } from '../spec-utils';
import { Event } from '../models';


describe('Event info endpoint', function() {
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
    });

    after(async function() {
        await Promise.all([event.destroy(), user.destroy()]);
    });

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

    it('creates a new event', async function() {
        let { data } = await requestAuth.post(`/api/event/`, {
            data: {
                title: 'A New Event',
                location: 'Mars',
            },
        });

        ({ data } = await request.get(`/api/event/${data.data.id}`));
        expect(data.data.title).to.equal('A New Event');
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
