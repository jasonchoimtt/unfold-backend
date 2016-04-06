import sinon from 'sinon';
import * as msTranslator from '../services/ms-translator';
import { request, withCreateTestUser } from '../spec-utils';


describe('Translate endpoint', function() {
    let requestAuth;

    withCreateTestUser(vars => { ({ requestAuth } = vars); });

    after(function() {
        if (msTranslator.translate.restore)
            msTranslator.translate.restore();
    });

    it('relays a translation request correctly', async function() {
        sinon.stub(msTranslator, 'translate', (content, options) => {
            return Promise.resolve({
                from: 'en',
                to: 'zh-hant',
                content: '世界您好！',
            });
        });

        let resp = await requestAuth.post('/api/translate', {
            to: 'zh-hant',
            content: 'Hello, world!',
        });

        expect(msTranslator.translate).to.have.been.calledOnce; // eslint-disable-line
        let [content, options] = msTranslator.translate.firstCall.args;
        expect(content).to.equal('Hello, world!');
        expect(options).to.have.property('to', 'zh-hant');
        expect(options).to.have.property('from').which.is.not.ok; // eslint-disable-line

        expect(resp.data).to.have.property('from', 'en');
        expect(resp.data).to.have.property('to', 'zh-hant');
        expect(resp.data).to.have.property('content').which.matches(/世界/);
    });

    it('requires authentication to translate text', async function() {
        await expect(request.post('/api/translate', {
            to: 'zh-hant',
            content: 'Hello, world!',
        }))
            .to.be.rejected.and.eventually.include({ status: 401 });
    });
});
