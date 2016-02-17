import { wait, runApp, request } from '../spec-utils';

describe('Server', () => {
    beforeAll(wait(runApp));

    it('just works!', wait(async function() {
        let resp = null;
        resp = await request.get('api/');
        expect(resp.data.data).toEqual('It works!');
    }));
});
