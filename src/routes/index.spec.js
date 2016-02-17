import { request } from '../spec-utils';

describe('Server', function() {
    it('just works!', async function() {
        let resp = null;
        resp = await request.get('api/');
        expect(resp.data.data).to.equal('It works!');
    });
});
