import _ from 'lodash';
import { request, withCreateEvent, withCreatePosts } from '../../spec-utils';
import { queue } from '../../scraper/queue';

describe('Timeline endpoint', function() {
    let requestAuth, event, user;

    withCreateEvent(vars => { ({ requestAuth, event, user } = vars); });
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
        const expectData = data => {
            expect(data).to.have.property('caption', 'I like self posts!');
            expect(data).to.have.property('data').that.is.null; // eslint-disable-line
            expect(data).to.have.property('tags')
                .to.include.something.equal('HK').and
                .to.include.something.equal('BC');
            expect(data).to.have.deep.property('author.id', user.id);
        };

        let resp = await requestAuth.post(`/api/event/${event.id}/timeline`, {
            caption: 'I like self posts!',
            tags: ['HK', 'BC'],
        });
        expect(resp.status).to.equal(201);
        expectData(resp.data);

        resp = await request.get(`/api/event/${event.id}/timeline`);
        expectData(resp.data.posts[0]);

        expect(queue.testMode.jobs).to.have.length(0);
    });

    it('creates a new link post and requests scraping', async function() {
        const expectData = data => {
            expect(data).to.have.property('caption', 'A link');
            expect(data).to.have.deep.property('data.url', 'http://www.example.com/');
            expect(data).to.have.deep.property('author.id', user.id);
        };
        let resp = await requestAuth.post(`/api/event/${event.id}/timeline`, {
            caption: 'A link',
            data: { url: 'http://www.example.com/' },
        });
        expect(resp.status).to.equal(201);
        expectData(resp.data);

        resp = await request.get(`/api/event/${event.id}/timeline`);
        expectData(resp.data.posts[0]);

        expect(queue.testMode.jobs).to.have.length(1);
        expect(queue.testMode.jobs[0]).to.have.property('type', 'Scrap Link');
    });

    it('requires authentication to create posts', async function() {
        await expect(
            request.post(`/api/event/${event.id}/timeline`, {
                caption: 'I like self posts!',
            }))
            .to.be.rejected.and.eventually.have.property('status', 401);
    });

    it('rejects creating an invalid post', async function() {
        await expect(
            requestAuth.post(`/api/event/${event.id}/timeline`, {
                caption: 11,
            }))
            .to.be.rejected.and.eventually
                .have.deep.property('data.error.message').which.includes('caption');
    });

    it('rejects creating an empty post', async function() {
        await expect(
            requestAuth.post(`/api/event/${event.id}/timeline`, {}))
            .to.be.rejected.and.eventually
                .include({ status: 400 }).and
                .have.deep.property('data.error.message')
                    .which.includes('caption').and.includes('data.url');
    });
});
