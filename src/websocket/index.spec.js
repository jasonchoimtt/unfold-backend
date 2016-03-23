import { WebSocketTestClient } from './spec-utils';


describe('WebSocket', function() {
    it('works', async function() {
        let client = new WebSocketTestClient();
        await client.connect('/api');

        expect(await client.nextJSON()).to.have.property('data', 'It works!');

        await client.nextClose();
    });
});
