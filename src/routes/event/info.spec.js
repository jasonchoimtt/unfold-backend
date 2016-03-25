import { request, createTestUser, withCreateEvent } from '../../spec-utils';
import { Role } from '../../models';


describe('Event info endpoint', function() {
    let user, requestAuth, event;

    withCreateEvent(vars => { ({ user, requestAuth, event } = vars); });

    it('delivers a brief list of events with basic information', async function() {
        let resp = await request.get('/api/event/');
        expect(resp.data).to.include.something
                .with.property('title', 'Test Event');
        expect(resp.data).to.all.not.have.keys('roles', 'description');
    });

    it('delivers an event with information and roles', async function() {
        let resp = await request.get(`/api/event/${event.id}`);
        expect(resp.data.title).to.equal('Test Event');
        expect(resp.data.roles[0].type).to.equal('OWNER');
        expect(resp.data.roles[0].user).to.have.property('id', 'test_user');
        expect(resp.data.roles[0].user).not.to.have.property('password');
    });

    it('creates a new event with an owner role', async function() {
        let resp = await requestAuth.post(`/api/event/`, {
            title: 'A New Event',
            location: 'Mars',
            information: 'Looking for contributors',
        });
        expect(resp.status).to.equal(201);

        resp = await request.get(`/api/event/${resp.data.id}`);
        expect(resp.data.title).to.equal('A New Event');
        expect(resp.data.location).to.equal('Mars');
        expect(resp.data.information).to.equal('Looking for contributors');
        expect(resp.data.roles).to.have.length(1);
        expect(resp.data.roles[0]).to.have.deep.property('user.id', user.id);
    });

    it('updates the event information', async function() {
        await requestAuth.put(`/api/event/${event.id}`, {
            tags: ['Hong Kong', 'Social'],
            description: 'Lorem ipsum',
            information: 'International stuff'.repeat(100),
            startedAt: new Date(2014, 9, 26),
            endedAt: new Date(2015, 9, 26),
            timezone: 8,
            language: 'zh-hk',
        });
        let resp = await request.get(`/api/event/${event.id}`);

        let evt = resp.data;
        expect(evt.tags).to.deep.equal(['Hong Kong', 'Social']);
        expect(evt.description).to.equal('Lorem ipsum');
        expect(evt.information).to.equal('International stuff'.repeat(100));
        expect(new Date(evt.startedAt).getTime()).to.equal(new Date(2014, 9, 26).getTime());
        expect(new Date(evt.endedAt).getTime()).to.equal(new Date(2015, 9, 26).getTime());
        expect(evt.timezone).to.equal(8);
        expect(evt.language).to.equal('zh-hk');
    });

    it('requires authentication to create and change events', async function() {
        await (async () => {
            try {
                await request.post(`/api/event/`, {
                    title: 'A New Event',
                    location: 'Mars',
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
                    tags: ['Hong Kong', 'Social'],
                });
            } catch (err) {
                expect(err.status).to.equal(401);
                return;
            }
            throw new Error('error not thrown');
        })();
    });

    describe('roles', function() {
        let user2;
        before(async function() {
            user2 = (await createTestUser('test_user2')).user;
        });
        after(async function() {
            await user2.destroy();
        });

        it('delivers a list of roles', async function() {
            let resp = await request.get(`/api/event/${event.id}/roles`);

            expect(resp.data).to.have.length(1);
            expect(resp.data[0]).to.have.deep.property('user.id', user.id);
            expect(resp.data[0]).to.have.property('type', Role.OWNER);
        });

        it('creates, changes and deletes a role', async function() {
            // create
            let resp = await requestAuth.patch(`/api/event/${event.id}/roles`, [
                {
                    type: Role.CONTRIBUTOR,
                    userId: user2.id,
                },
            ]);

            expect(resp.data).to.have.length(2);
            expect(resp.data).to.include.something
                .that.satisfies(x => x.user.id === user2.id && x.type === Role.CONTRIBUTOR);

            // update
            resp = await requestAuth.patch(`/api/event/${event.id}/roles`, [
                {
                    type: Role.TRANSLATOR,
                    userId: user2.id,
                },
            ]);

            expect(resp.data).to.have.length(2);
            expect(resp.data).to.include.something
                .that.satisfies(x => x.user.id === user2.id && x.type === Role.TRANSLATOR);

            // delete
            resp = await requestAuth.patch(`/api/event/${event.id}/roles`, [
                {
                    type: null,
                    userId: user2.id,
                },
            ]);

            expect(resp.data).to.have.length(1);
        });

        it('requires authentiction to change roles', async function() {
            try {
                await request.patch(`/api/event/${event.id}/roles`, [
                    {
                        type: Role.TRANSLATOR,
                        userId: user2.id,
                    },
                ]);
            } catch (err) {
                expect(err.status).to.equal(401);
                return;
            }
            throw new Error('no error thrown');
        });
    });
});
