import { WebSocketTestClient } from './spec-utils';


describe('WebSocket', function() {
    it('works', async function() {
        let client = new WebSocketTestClient();
        await client.connect('/api');

        expect(await client.nextJSON()).to.have.property('data', 'It works!');

        await client.nextClose();
    });

    it('404s on no route', async function() {
        let client = new WebSocketTestClient();
        try {
            await client.connect('/ridiculous');
        } catch (err) {
            expect(err.message).to.include('404');
            return;
        }

        throw new Error('error not thrown');
    });
});
