import { WebSocketTestClient } from './spec-utils';
import { withCreateEvent } from '../spec-utils';


describe('Event WebSocket', function() {
    let event;

    withCreateEvent(vars => { ({ event } = vars); });

    it('receives post creation events', async function() {
        let client = new WebSocketTestClient();
        let conn = await client.connect(`/event/${event.id}`);

        await event.createPost({ caption: 'Hate you' });

        let data = await client.nextJSON();

        expect(data).to.have.property('resource', 'post');
        expect(data).to.have.property('type', 'created');
        expect(data).to.have.deep.property('data.caption', 'Hate you');

        conn.close();
    });

    it('receives post update events', async function() {
        let post = await event.createPost({ caption: 'Hate you' });

        let client = new WebSocketTestClient();
        let conn = await client.connect(`/event/${event.id}`);

        await post.update({ data: { url: 'http://www.example.com' } });

        let data = await client.nextJSON();

        expect(data).to.have.property('resource', 'post');
        expect(data).to.have.property('type', 'updated');
        expect(data).to.have.deep.property('data.caption', 'Hate you');
        expect(data).to.have.deep.property('data.data.url', 'http://www.example.com');

        conn.close();
    });

    it('404s when event is not found', async function() {
        let client = new WebSocketTestClient();
        await expect(client.connect('/event/ridiculous'))
            .to.be.rejected.and.eventually.have.property('message').which.matches(/404/);
    });
});
