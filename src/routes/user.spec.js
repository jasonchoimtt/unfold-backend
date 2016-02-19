import { request, createTestUser } from '../spec-utils';
import { User } from '../models';


describe('User endpoint', function() {
    let user, requestAuth;

    beforeEach(async function() {
        ({ user, requestAuth } = await createTestUser());
        await user.update({
            firstName: 'Test',
            lastName: 'User',
            email: 'test.user@example.com',
            dateOfBirth: new Date(1999, 11, 31),
        });
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
            let { data } = await request.post('/api/user', {
                data: {
                    id: 'lorem_user',
                    password: '123456',
                    firstName: 'Lorem',
                    lastName: 'User',
                    email: 'lorem.user@example.com',
                    dateOfBirth: new Date(2000, 0, 1),
                },
            });

            expect(data.data).to.have.property('id', 'lorem_user');
            expect(data.data).not.to.have.property('password');
        });

        it('rejects incomplete registration', async function() {
            try {
                await request.post('/api/user', {
                    data: {
                        id: 'lorem_user',
                        password: '123456',
                        firstName: 'Lorem',
                        lastName: 'User',
                        dateOfBirth: new Date(2000, 0, 1),
                    },
                });
            } catch (err) {
                expect(err.status).to.equal(400);
                return;
            }

            throw new Error('no error thrown');
        });
    });

    it('displays a public user profile', async function() {
        let { data } = await request.get('/api/user/test_user');

        expect(data.data).to.have.property('id', 'test_user');
        expect(data.data).not.to.have.property('password');
        expect(data.data).to.have.property('firstName', 'Test');
        expect(data.data).to.have.property('lastName', 'User');
        expect(data.data).not.to.have.property('email');
        expect(data.data).not.to.have.property('dateOfBirth');
    });

    it('displays a complete private user profile', async function() {
        let { data } = await requestAuth.get('/api/user/test_user');

        expect(data.data).to.have.property('id', 'test_user');
        expect(data.data).not.to.have.property('password');
        expect(data.data).to.have.property('firstName', 'Test');
        expect(data.data).to.have.property('lastName', 'User');
        expect(data.data).to.have.property('email', 'test.user@example.com');
        expect(data.data).to.have.property('dateOfBirth')
                .that.satisfies(x => new Date(x).getTime() === new Date(1999, 11, 31).getTime());
    });

    it('updates profile information', async function() {
        let { requestAuth } = await createTestUser('test_user2');

        let { data } = await requestAuth.put('/api/user/test_user2', {
            data: {
                firstName: 'Hate',
                lastName: 'You',
            },
        });
        expect(data.data).to.have.property('firstName', 'Hate');
        expect(data.data).to.have.property('lastName', 'You');

        ({ data } = await request.get('/api/user/test_user2'));
        expect(data.data).to.have.property('firstName', 'Hate');
        expect(data.data).to.have.property('lastName', 'You');
    });
});
