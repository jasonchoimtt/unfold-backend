import { request, withCreateTestUser, withCreateEvent, withCreatePosts } from '../../spec-utils';
import { Role } from '../../models';


describe('Event info endpoint', function() {
    let user, requestAuth, event;
    let user2, requestAuth2;

    withCreateEvent(vars => { ({ user, requestAuth, event } = vars); });
    withCreateTestUser('test_user2', vars => {
        user2 = vars.user;
        requestAuth2 = vars.requestAuth;
    });
    withCreatePosts(() => { return { event }; });

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
        expect(resp.data).to.include({
            title: 'A New Event',
            location: 'Mars',
            information: 'Looking for contributors',
        });
        expect(resp.data.roles).to.have.length(1).and
            .all.have.deep.property('user.id', user.id);
    });

    it('updates the event information', async function() {
        let data = {
            tags: ['Hong Kong', 'Social'],
            description: 'Lorem ipsum',
            information: 'International stuff'.repeat(100),
            startedAt: new Date(2014, 9, 26).toJSON(),
            endedAt: new Date(2015, 9, 26).toJSON(),
            timezone: 8,
            language: 'zh-hk',
        };
        await requestAuth.put(`/api/event/${event.id}`, data);
        let resp = await request.get(`/api/event/${event.id}`);

        let evt = resp.data;
        expect(evt).to.containSubset(data);
    });

    it('rejects invalid data', async function() {
        await expect(requestAuth.post(`/api/event/`, {
            title: 'A New Event',
        }))
            .to.be.rejected.and.eventually
                .have.include({ status: 400 }).and
                .have.deep.property('data.error.message').which.matches(/location/);

        await expect(requestAuth.put(`/api/event/${event.id}`, {
            tags: '123',
        }))
            .to.be.rejected.and.eventually
                .have.include({ status: 400 }).and
                .have.deep.property('data.error.message').which.matches(/tags/);

        await expect(requestAuth.put(`/api/event/${event.id}`, {
            sth: 'ridiculous',
        }))
            .to.be.rejected.and.eventually
                .have.include({ status: 400 }).and
                .have.deep.property('data.error.message').which.matches(/sth/);

        await expect(requestAuth.put(`/api/event/${event.id}`, {
            language: 'zh-99',
            sth: 'ridiculous',
        }))
            .to.be.rejected.and.eventually
                .have.include({ status: 400 }).and
                .have.deep.property('data.error.message').which.matches(/language/);
    });

    it('requires authentication to create and change events', async function() {
        await expect(request.post(`/api/event/`, {
            title: 'A New Event',
            location: 'Mars',
        }))
            .to.be.rejected.and.eventually.have.property('status', 401);

        await expect(requestAuth2.put(`/api/event/${event.id}`, {
            tags: ['Hong Kong', 'Social'],
        }))
            .to.be.rejected.and.eventually
                .include({ status: 401 }).and
                .have.deep.property('data.error.message').which.matches(/only/);
    });

    describe('roles', function() {

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
            await expect(requestAuth2.patch(`/api/event/${event.id}/roles`, [
                {
                    type: Role.TRANSLATOR,
                    userId: user2.id,
                },
            ]))
                .to.be.rejected.and.eventually
                    .include({ status: 401 }).and
                    .have.deep.property('data.error.message').which.matches(/only/);
        });

        it('rejects on invalid user id', async function() {
            await expect(requestAuth.patch(`/api/event/${event.id}/roles`, [
                {
                    type: Role.TRANSLATOR,
                    userId: 'ridiculous',
                },
                {
                    type: Role.TRANSLATOR,
                    userId: user2.id,
                },
            ]))
                .to.be.rejected.and.eventually
                    .include({ status: 400 }).and
                    .have.deep.property('data.error.message').which.matches(/ridiculous/);

            let resp = await request.get(`/api/event/${event.id}/roles`);
            expect(resp.data).not.to.include.something
                .that.satisfies(x => x.type === Role.OWNER && x.user.id === user2.id);
        });
    });

    it('produces a summary of all tags', async function() {
        let resp = await request.get(`/api/event/${event.id}/tags`);

        expect(resp.data).to.have.lengthOf(2);
        expect(resp.data).to.include.something
            .which.satisfies(x => x.name === 'First' && x.frequency === 1);

        expect(resp.data).to.include.something
            .which.satisfies(x => x.name === 'Second' && x.frequency === 2);
    });
});
