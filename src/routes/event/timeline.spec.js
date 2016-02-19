import _ from 'lodash';
import { request } from '../../spec-utils';
import { withCreateEvent, withCreatePosts } from './spec-utils';


describe('Timeline endpoint', function() {
    let requestAuth, event;

    withCreateEvent(vars => ({ requestAuth, event } = vars));
    withCreatePosts(() => ({ event }));

    it('delivers recent posts by default', async function() {
        let { data } = await request.get(`/api/event/${event.id}/timeline`);

        expect(data.data).to.have.length(3);
        expect(data.data).to.deep.equal(
                _.sortBy(data.data, x => new Date(x.createdAt).getTime() * -1));

        expect(data.data).to.all.not.have.key('dataAuthor');
    });

    it('delivers posts in the specified period', async function() {
        let { data } = await request.get(`/api/event/${event.id}/timeline`, {
            params: {
                begin: new Date(2014, 9, 26, 18),
                end: new Date(2014, 9, 26, 20),
            },
        });

        expect(data.data).to.have.length(1);
        expect(data.data).to.all.satisfy(
                x => new Date(x.createdAt).getTime() === new Date(2014, 9, 26, 19).getTime());
    });

    it('creates a new self post', async function() {
        await requestAuth.post(`/api/event/${event.id}/timeline`, {
            data: {
                caption: 'I like self posts!',
            },
        });

        let { data } = await request.get(`/api/event/${event.id}/timeline`);

        expect(data.data[0]).to.have.property('caption', 'I like self posts!');
        expect(data.data[0]).to.have.property('data').that.is.null; // eslint-disable-line
    });

    it('creates a new link post', async function() {
        await requestAuth.post(`/api/event/${event.id}/timeline`, {
            data: {
                caption: 'A link',
                data: { link: 'http://www.example.com/' },
            },
        });

        let { data } = await request.get(`/api/event/${event.id}/timeline`);

        expect(data.data[0]).to.have.property('caption', 'A link');
        expect(data.data[0]).to.have.property('data')
            .that.has.property('link', 'http://www.example.com/');
    });

    it('requires authentication to create posts', async function() {
        try {
            await request.post(`/api/event/${event.id}/timeline`, {
                data: {
                    caption: 'I like self posts!',
                },
            });
        } catch (err) {
            expect(err.status).to.equal(401);
            return;
        }
        throw new Error('error not thrown');
    });

    it('rejects creating an empty post', async function() {
        try {
            await requestAuth.post(`/api/event/${event.id}/timeline`, { data: {} });
        } catch (err) {
            expect(err.status).to.equal(400);
            return;
        }
        throw new Error('error not thrown');
    });
});