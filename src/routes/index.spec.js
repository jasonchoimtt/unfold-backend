import { request } from '../spec-utils';

import { Config } from '../config';

describe('Server', function() {
    it('just works!', async function() {
        let resp = await request.get('api/');
        expect(resp.data.message).to.equal('It works!');
    });

    it('sets access control header correctly', async function() {
        let expected = {
            'access-control-allow-origin': Config.accessControl.allowOrigin,
            'access-control-max-age': Config.accessControl.maxAge.toString(),
        };

        let resp = await request.get('api/');
        expect(resp.headers).to.containSubset(expected);

        resp = await request.request({
            url: 'api/',
            method: 'options',
        });
        expect(resp.headers).to.containSubset(expected);
        expect(resp.headers).to.have.property('access-control-allow-headers')
            .which.matches(/Authorization/).and
                .matches(/Content-Type/).and
                .matches(/Accept/);
        expect(resp.headers).to.have.property('access-control-allow-methods')
            .which.matches(/GET/).and
                .matches(/PUT/).and
                .matches(/POST/).and
                .matches(/PATCH/);
    });

    it('sends access control headers even if authorization fails', async function() {
        await expect(request.put(`api/`, {
            something: 'stupid',
        }, {
            headers: { 'Authorization': 'funny thing' },
        }))
            .to.be.rejected.and.eventually
                .include({ status: 401 }).and
                .have.property('headers').which.has.property('access-control-allow-origin');
    });

    it('sets default cache control header correctly', async function() {
        let resp = await request.get('api/');
        expect(resp.headers).to.have.property('cache-control', 'private, max-age=0');
    });
});
