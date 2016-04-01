import { WebSocketTestClient } from './spec-utils';


describe('WebSocket', function() {
    it('works', async function() {
        let client = new WebSocketTestClient();
        await client.connect('/ws');

        expect(await client.nextJSON()).to.have.property('data', 'It works!');

        await client.nextClose();
    });

    it('404s on no route', async function() {
        let client = new WebSocketTestClient();
        await expect(client.connect('/ridiculous'))
            .to.be.rejected.and.eventually.have.property('message').which.matches(/404/);
    });
});
