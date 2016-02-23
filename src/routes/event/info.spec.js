import { request, createTestUser } from '../../spec-utils';
import { Role } from '../../models';
import { withCreateEvent } from './spec-utils';


describe('Event info endpoint', function() {
    let user, requestAuth, event;

    withCreateEvent(vars => { ({ user, requestAuth, event } = vars); });

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

    describe('roles', function() {
        let user2;
        before(async function() {
            user2 = (await createTestUser('test_user2')).user;
        });
        after(async function() {
            await user2.destroy();
        });

        it('delivers a list of roles', async function() {
            let { data } = await request.get(`/api/event/${event.id}/roles`);

            expect(data.data).to.have.length(1);
            expect(data.data[0]).to.have.deep.property('user.id', user.id);
            expect(data.data[0]).to.have.property('type', Role.OWNER);
        });

        it('creates, changes and deletes a role', async function() {
            // create
            let { data } = await requestAuth.put(`/api/event/${event.id}/roles`, {
                data: [{
                    type: Role.CONTRIBUTOR,
                    userId: user2.id,
                }],
            });

            expect(data.data).to.have.length(2);
            expect(data.data).to.include.something
                .that.satisfies(x => x.user.id === user2.id && x.type === Role.CONTRIBUTOR);

            // update
            ({ data } = await requestAuth.put(`/api/event/${event.id}/roles`, {
                data: [{
                    type: Role.TRANSLATOR,
                    userId: user2.id,
                }],
            }));

            expect(data.data).to.have.length(2);
            expect(data.data).to.include.something
                .that.satisfies(x => x.user.id === user2.id && x.type === Role.TRANSLATOR);

            // delete
            ({ data } = await requestAuth.put(`/api/event/${event.id}/roles`, {
                data: [{
                    type: null,
                    userId: user2.id,
                }],
            }));

            expect(data.data).to.have.length(1);
        });

        it('requires authentiction to change roles', async function() {
            try {
                await request.put(`/api/event/${event.id}/roles`, {
                    data: [{
                        type: Role.TRANSLATOR,
                        userId: user2.id,
                    }],
                });
            } catch (err) {
                expect(err.status).to.equal(401);
                return;
            }
            throw new Error('no error thrown');
        });
    });
});
