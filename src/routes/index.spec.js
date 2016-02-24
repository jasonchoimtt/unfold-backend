import { request } from '../spec-utils';

describe('Server', function() {
    it('just works!', async function() {
        let resp = await request.get('api/');
        expect(resp.data.message).to.equal('It works!');
    });
});
