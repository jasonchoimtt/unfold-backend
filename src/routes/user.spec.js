import { request, createTestUser } from '../spec-utils';
import { User } from '../models';


describe('User endpoint', function() {
    let user, requestAuth, requestAuth2;

    beforeEach(async function() {
        ({ user, requestAuth } = await createTestUser());
        await user.update({
            name: 'Test User',
            email: 'test.user@example.com',
            dateOfBirth: new Date(1999, 11, 31),
        });
        requestAuth2 = (await createTestUser('test_user2')).requestAuth;
    });

    afterEach(async function() {
        await User.destroy({
            where: {
                id: { $in: ['test_user', 'test_user2', 'lorem_user'] },
            },
        });
    });

    describe('registration', function() {
        it('registers a new user', async function() {
            let resp = await request.post('/api/user', {
                id: 'lorem_user',
                password: '12345678',
                name: 'Lorem User',
                email: 'lorem.user@example.com',
                dateOfBirth: new Date(2000, 0, 1),
            });

            expect(resp.status).to.equal(201);
            expect(resp.data).to.have.property('id', 'lorem_user');
            expect(resp.data).not.to.have.property('password');

            resp = await request.post('/api/auth', {
                username: 'lorem_user',
                password: '12345678',
            });

            expect(resp.data).to.have.property('token');
            expect(resp.data).to.have.property('exp');
        });

        it('rejects registered names', async function() {
            await expect(
                request.post('/api/user', {
                    id: 'TEST_user', // case-insensitive
                    password: '12345678',
                    name: 'Lorem User',
                    email: 'lorem.user@example.com',
                    dateOfBirth: new Date(2000, 0, 1),
                }))
                .to.be.rejected.and.eventually
                    .include({ status: 400 })
                    .and.have.deep.property('data.error.message').which.matches(/TEST_user/);

            await expect(
                request.post('/api/user', {
                    id: 'test_user',
                    password: '12345678',
                    name: 'Lorem User',
                    email: 'lorem.user@example.com',
                    dateOfBirth: new Date(2000, 0, 1),
                }))
                .to.be.rejected.and.eventually
                    .include({ status: 400 })
                    .and.have.deep.property('data.error.message').which.matches(/test_user/);
        });

        it('rejects invalid field', async function() {
            await expect(
                request.post('/api/user', {
                    id: 'lorem_user',
                    password: '12345678',
                    name: 'Lorem User',
                    email: 'lorem.user_example.com',
                    dateOfBirth: new Date(2000, 0, 1),
                }))
                .to.be.rejected.and.eventually
                    .include({ status: 400 })
                    .and.have.deep.property('data.error.message')
                        .which.matches(/email/);
        });

        it('rejects incomplete registration', async function() {
            await expect(request.post('/api/user', {
                data: {
                    id: 'lorem_user',
                    password: '12345678',
                    name: 'Lorem User',
                    dateOfBirth: new Date(2000, 0, 1),
                },
            }))
                .to.be.rejected.and.eventually.have.property('status', 400);
        });
    });

    it('displays a public user profile', async function() {
        let resp = await request.get('/api/user/test_user');

        expect(resp.data).to.have.property('id', 'test_user');
        expect(resp.data).not.to.have.property('password');
        expect(resp.data).to.have.property('name', 'Test User');
        expect(resp.data).not.to.have.property('email');
        expect(resp.data).not.to.have.property('dateOfBirth');
        expect(resp.data).to.have.property('profile'); // = {}
    });

    it('is case-insensitive in displaying profile', async function() {
        expect(await request.get('/api/user/TEST_user')).to.be.ok; // eslint-disable-line
    });

    it('displays a complete private user profile', async function() {
        let resp = await requestAuth.get('/api/user/test_user');

        expect(resp.data).to.have.property('id', 'test_user');
        expect(resp.data).not.to.have.property('password');
        expect(resp.data).to.have.property('name', 'Test User');
        expect(resp.data).to.have.property('email', 'test.user@example.com');
        expect(resp.data).to.have.property('dateOfBirth')
                .that.satisfies(x => new Date(x).getTime() === new Date(1999, 11, 31).getTime());
    });

    it('updates profile information', async function() {
        let resp = await requestAuth2.put('/api/user/test_user2', {
            name: 'Hate You',
            profile: {
                description: 'I am a boy',
            },
        });
        expect(resp.data).to.have.property('name', 'Hate You');
        expect(resp.data).to.have.property('email');
        expect(resp.data).to.have.deep.property('profile.description', 'I am a boy');

        resp = await request.get('/api/user/test_user2');
        expect(resp.data).to.have.property('name', 'Hate You');
    });

    it('requires authentication to update profile information', async function() {
        await expect(requestAuth.put('/api/user/test_user2', {
            name: 'Love You',
            profile: {
                description: 'I am not a boy',
            },
        }))
            .to.be.rejected.and.eventually
                .include({ status: 401 }).and
                .have.deep.property('data.error.message').which.matches(/only/);
    });
});
