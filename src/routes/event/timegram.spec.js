import { request, withCreateEvent, withCreatePosts } from '../../spec-utils';


describe('Timegram endpoint', function() {
    let event;

    withCreateEvent(vars => { ({ event } = vars); });
    withCreatePosts(() => { return { event }; });

    it('delivers an overview timegram by default', async function() {
        let resp = await request.get(`/api/event/${event.id}/timegram`);

        expect(resp.data.timegram).to.have.length(9);
        expect(resp.data.span).to.have.property('resolution', 86400);
        expect(resp.data.timegram[2]).to.have.property('frequency', 3);
    });

    it('delivers a timegram in the specified period and resolution', async function() {
        let resp = await request.get(`/api/event/${event.id}/timegram`, {
            params: {
                begin: new Date(2014, 9, 26, 0),
                end: new Date(2014, 9, 27, 0),
                resolution: 3600,
            },
        });

        expect(resp.data.timegram).to.have.length(24);
        [19, 20, 21].map(hour => {
            expect(resp.data.timegram[23 - hour]).to.have.property('frequency', 1);
        });
    });

    it('delivers a sparse timegram on request', async function() {
        let resp = await request.get(`/api/event/${event.id}/timegram`, {
            params: {
                begin: new Date(2014, 9, 26, 0),
                end: new Date(2014, 9, 27, 0),
                resolution: 3600,
                sparse: true,
            },
        });

        expect(resp.data.timegram).to.have.length(3);
        [19, 20, 21].map(hour => {
            expect(resp.data.timegram[21 - hour])
                .to.have.property('begin', new Date(2014, 9, 26, hour).toJSON());
            expect(resp.data.timegram[21 - hour]).to.have.property('frequency', 1);
        });
    });
});
