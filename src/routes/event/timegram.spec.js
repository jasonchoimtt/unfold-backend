import { request } from '../../spec-utils';
import { withCreateEvent, withCreatePosts } from './spec-utils';


describe('Timegram endpoint', function() {
    let event;

    withCreateEvent(vars => { ({ event } = vars); });
    withCreatePosts(() => { return { event }; });

    it('delivers an overview timegram by default', async function() {
        let { data } = await request.get(`/api/event/${event.id}/timegram`);

        expect(data.data).to.have.length(9);
        expect(data.span).to.have.property('resolution', 86400);
        expect(data.data[2]).to.have.property('frequency', 3);
    });

    it('delivers a timegram in the specified period and resolution', async function() {
        let { data } = await request.get(`/api/event/${event.id}/timegram`, {
            params: {
                begin: new Date(2014, 9, 26, 0),
                end: new Date(2014, 9, 27, 0),
                resolution: 3600,
            },
        });

        expect(data.data).to.have.length(24);
        [19, 20, 21].map(hour => {
            expect(data.data[23 - hour]).to.have.property('frequency', 1);
        });
    });
});
