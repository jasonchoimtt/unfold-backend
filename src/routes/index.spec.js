import { request } from '../spec-utils';

import { Config } from '../config';

describe('Server', function() {
    it('just works!', async function() {
        let resp = await request.get('api/');
        expect(resp.data.message).to.equal('It works!');
    });

    it('sets access control header correctly', async function() {
        const expectHeaders = headers => {
            expect(headers).to.have.property('access-control-allow-origin',
                                             Config.accessControl.allowOrigin);
            expect(headers).to.have.property('access-control-max-age',
                                             Config.accessControl.maxAge.toString());
            expect(headers).to.have.property('access-control-allow-headers',
                                             'Authorization');
        };

        let resp = await request.get('api/');
        expectHeaders(resp.headers);

        resp = await request.request({
            url: 'api/',
            method: 'options',
        });
        expectHeaders(resp.headers);
    });

    it('sets default cache control header correctly', async function() {
        let resp = await request.get('api/');
        expect(resp.headers).to.have.property('cache-control', 'private, max-age=0');
    });
});
