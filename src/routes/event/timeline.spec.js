import _ from 'lodash';
import { request } from '../../spec-utils';
import { withCreateEvent, withCreatePosts } from './spec-utils';
import { queue } from '../../scraper/queue';


describe('Timeline endpoint', function() {
    let requestAuth, event;

    withCreateEvent(vars => { ({ requestAuth, event } = vars); });
    withCreatePosts(() => { return { event }; });

    before(function() {
        queue.testMode.enter();
    });

    after(function() {
        queue.testMode.exit();
    });

    it('delivers recent posts by default', async function() {
        let resp = await request.get(`/api/event/${event.id}/timeline`);

        expect(resp.data.posts).to.have.length(3);
        expect(resp.data.posts).to.deep.equal(
                _.sortBy(resp.data.posts, x => new Date(x.createdAt).getTime() * -1));

        expect(resp.data.posts).to.all.not.have.key('dataAuthor');
    });

    it('delivers posts in the specified period', async function() {
        let resp = await request.get(`/api/event/${event.id}/timeline`, {
            params: {
                begin: new Date(2014, 9, 26, 18),
                end: new Date(2014, 9, 26, 20),
            },
        });

        expect(resp.data.posts).to.have.length(1);
        expect(resp.data.posts).to.all.satisfy(
                x => new Date(x.createdAt).getTime() === new Date(2014, 9, 26, 19).getTime());
    });

    it('creates a new self post', async function() {
        await requestAuth.post(`/api/event/${event.id}/timeline`, {
            caption: 'I like self posts!',
        });

        let resp = await request.get(`/api/event/${event.id}/timeline`);

        expect(resp.data.posts[0]).to.have.property('caption', 'I like self posts!');
        expect(resp.data.posts[0]).to.have.property('data').that.is.null; // eslint-disable-line

        expect(queue.testMode.jobs).to.have.length(0);
    });

    it('creates a new link post and requests scraping', async function() {
        await requestAuth.post(`/api/event/${event.id}/timeline`, {
            caption: 'A link',
            data: { url: 'http://www.example.com/' },
        });

        let resp = await request.get(`/api/event/${event.id}/timeline`);

        expect(resp.data.posts[0]).to.have.property('caption', 'A link');
        expect(resp.data.posts[0]).to.have.property('data')
            .that.has.property('url', 'http://www.example.com/');

        expect(queue.testMode.jobs).to.have.length(1);
        expect(queue.testMode.jobs[0]).to.have.property('type', 'Scrap Link');
    });

    it('requires authentication to create posts', async function() {
        try {
            await request.post(`/api/event/${event.id}/timeline`, {
                caption: 'I like self posts!',
            });
        } catch (err) {
            expect(err.status).to.equal(401);
            return;
        }
        throw new Error('error not thrown');
    });

    it('rejects creating an empty post', async function() {
        try {
            await requestAuth.post(`/api/event/${event.id}/timeline`, {});
        } catch (err) {
            expect(err.status).to.equal(400);
            return;
        }
        throw new Error('error not thrown');
    });
});
