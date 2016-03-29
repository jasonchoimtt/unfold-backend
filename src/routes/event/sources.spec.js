import { withCreateEvent } from '../../spec-utils';


describe('Event sources endpoint', function() {
    let requestAuth, event;

    withCreateEvent(vars => { ({ requestAuth, event } = vars); });

    afterEach(async function() {
        await Promise.all((await event.getSources()).map(x => x.destroy()));
    });

    it('delivers a list of sources', async function() {
        await event.createSource({
            type: 'TWITTER_USER',
            config: { section: 'realdrumpf' },
        });

        let resp = await requestAuth.get(`/api/event/${event.id}/sources`);

        expect(resp.data).to.have.lengthOf(1).and
            .include.something.that.satisfies(
                x => x.type === 'TWITTER_USER' && x.config.section === 'realdrumpf');

        expect(resp.data).to.include.something.that.satisfies(
            x => x.name.match(/realdrumpf/) && x.url.match(/realdrumpf/));
    });

    it('creates new sources and performs validation', async function() {
        await requestAuth.patch(`/api/event/${event.id}/sources`, []); // noop

        let resp = await requestAuth.patch(`/api/event/${event.id}/sources`, [
            {
                type: 'TWITTER_USER',
                config: { section: 'realomama' },
            },
        ]);

        expect(resp.data).to.have.lengthOf(1).and
            .include.something.that.satisfies(
                x => x.type === 'TWITTER_USER' && x.config.section === 'realomama');

        expect(resp.data).to.include.something.that.satisfies(
            x => x.name.match(/realomama/) && x.url.match(/realomama/));

        const fails = [
            [{
                type: null,
            }],
            [{
                type: 'RIDICULOUS',
                config: {},
            }],
            [{
                id: resp.data[0].id,
                type: 'TWITTER_USER',
                // missing config
            }],
        ];

        for (const data of fails) {
            await expect(requestAuth.patch(`/api/event/${event.id}/sources`), data)
                .to.be.rejected.and.eventually.include({ status: 400 });
        }
    });

    it('changes and deletes a source', async function() {
        let resp = await requestAuth.patch(`/api/event/${event.id}/sources`, [
            {
                type: 'TWITTER_USER',
                config: { section: 'realomama' },
            },
        ]);

        resp = await requestAuth.patch(`/api/event/${event.id}/sources`, [
            {
                id: resp.data[0].id,
                type: 'TWITTER_USER',
                config: { section: 'fakeomama' },
            },
        ]);

        expect(resp.data).to.have.lengthOf(1).and
            .include.something.that.satisfies(
                x => x.type === 'TWITTER_USER' && x.config.section === 'fakeomama');

        resp = await requestAuth.patch(`/api/event/${event.id}/sources`, [
            {
                id: resp.data[0].id,
                type: null,
            },
        ]);

        expect(resp.data).to.be.empty; // eslint-disable-line
    });
});
