import { wait, runApp, request } from '../spec-utils';
import { User } from '../models';


describe('Authentication endpoints', () => {
    beforeAll(wait(async function() {
        await runApp();
        let user = User.build({
            id: 'test_user',
        });
        await user.setPassword('test_pw');
        await user.save();
    }));

    afterAll(wait(async function() {
        await User.destroy({ where: { id: 'test_user' } });
    }));

    it('authenticates by username and password', wait(async function() {
        let resp = await request.post('api/auth/', {
            username: 'test_user',
            password: 'test_pw',
        });
        expect(resp.data.token).not.toBeNull();
        expect(resp.data.exp).not.toBeNull();
    }));

    it('rejects a non-existent user', wait(async function() {
        try {
            await request.post('api/auth/', {
                username: 'invalid_user',
                password: 'gibberish',
            });
        } catch (err) {
            expect(err.status).toEqual(401);
            return;
        }
        fail('no error thrown');
    }));

    it('rejects an incorrect password', wait(async function() {
        try {
            await request.post('api/auth/', {
                username: 'test_user',
                password: 'gibberish',
            });
        } catch (err) {
            expect(err.status).toEqual(401);
            return;
        }
        fail('no error thrown');
    }));

    it('renews a token', wait(async function() {
        let resp = await request.post('api/auth/', {
            username: 'test_user',
            password: 'test_pw',
        });
        let token = resp.data.token;
        await new Promise(resolve => setTimeout(resolve, 1000));
        resp = await request.post('api/auth/', {
            token: token,
        });
        expect(resp.data.token).not.toBeNull();
        expect(resp.data.token).not.toEqual(token);
    }));
});
