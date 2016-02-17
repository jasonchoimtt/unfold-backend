import { request } from '../spec-utils';
import { User } from '../models';


describe('Authentication endpoint', function() {
    before(async function() {
        let user = User.build({
            id: 'test_user',
        });
        await user.setPassword('test_pw');
        await user.save();
    });

    after(async function() {
        await User.destroy({ where: { id: 'test_user' } });
    });

    it('authenticates by username and password', async function() {
        let resp = await request.post('api/auth/', {
            username: 'test_user',
            password: 'test_pw',
        });
        expect(resp.data.token).not.to.be.null();
        expect(resp.data.exp).not.to.be.null();
    });

    it('rejects a non-existent user', async function() {
        try {
            await request.post('api/auth/', {
                username: 'invalid_user',
                password: 'gibberish',
            });
        } catch (err) {
            expect(err.status).to.equal(401);
            return;
        }
        throw new Error('no error thrown');
    });

    it('rejects an incorrect password', async function() {
        try {
            await request.post('api/auth/', {
                username: 'test_user',
                password: 'gibberish',
            });
        } catch (err) {
            expect(err.status).to.equal(401);
            return;
        }
        throw new Error('no error thrown');
    });

    it('renews a token', async function() {
        let resp = await request.post('api/auth/', {
            username: 'test_user',
            password: 'test_pw',
        });
        let token = resp.data.token;
        await new Promise(resolve => setTimeout(resolve, 1000));
        resp = await request.post('api/auth/', {
            token: token,
        });
        expect(resp.data.token).not.to.be.null();
        expect(resp.data.token).not.to.equal(token);
    });
});
