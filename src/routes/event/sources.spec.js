/* eslint-disable no-unused-expressions */
import { withCreateEvent } from '../../spec-utils';


describe('Event sources endpoint', function() {
    let requestAuth, event;

    withCreateEvent(vars => { ({ requestAuth, event } = vars); });

    afterEach(async function() {
        await Promise.all((await event.getSources()).map(x => x.destroy()));
    });

    it('delivers a list of sources', async function() {
        await event.createSource({
            type: 'twitter',
            config: { users: ['realdrumpf'] },
        });

        let resp = await requestAuth.get(`/api/event/${event.id}/sources`);

        expect(resp.data).to.have.lengthOf(1).and
            .include.something.that.satisfies(
                x => x.type === 'twitter' && x.config.users.indexOf('realdrumpf') !== -1);
    });

    it('creates new sources and performs validation', async function() {
        await requestAuth.patch(`/api/event/${event.id}/sources`, []); // noop

        let resp = await requestAuth.patch(`/api/event/${event.id}/sources`, [
            {
                type: 'twitter',
                config: { hashtags: ['#MakeHKGreatAgain'] },
            },
        ]);

        expect(resp.data).to.have.lengthOf(1).and
            .include.something.that.satisfies(
                x => x.type === 'twitter' && x.config.hashtags.indexOf('MakeHKGreatAgain') !== -1);

        const fails = [
            [{
                type: null,
            }],
            [{
                type: 'ridiculous',
                config: {},
            }],
            [{
                type: 'twitter',
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
                type: 'twitter',
                config: { users: ['realomama'] },
            },
        ]);

        resp = await requestAuth.patch(`/api/event/${event.id}/sources`, [
            {
                type: 'twitter',
                config: { users: ['realomama'], hashtags: ['MakeHKGreatAgain'] },
            },
        ]);

        expect(resp.data).to.have.lengthOf(1).and
            .include.something.that.satisfies(
                x => x.type === 'twitter' &&
                x.config.users.indexOf('realomama') !== -1 &&
                x.config.hashtags.indexOf('MakeHKGreatAgain') !== -1
            );

        resp = await requestAuth.patch(`/api/event/${event.id}/sources`, [
            {
                type: 'twitter',
                config: null,
            },
        ]);

        expect(resp.data).to.be.empty;
    });
});
