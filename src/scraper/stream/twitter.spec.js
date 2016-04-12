/* eslint-disable no-unused-expressions */
import sinon from 'sinon';
import _ from 'lodash';
import { client } from './client';
import { Twitter } from './twitter';
import { withCreateEvent } from '../../spec-utils';
import { StringReadable } from './spec-utils';


describe('Twitter stream scraper', function() {
    let event;

    withCreateEvent(vars => { ({ event } = vars); });

    before(() => {
        client.defaults.adapter = sinon.spy((resolve, reject, config) => {
            let resp = {
                status: 200,
                statusText: 'OK',
                headers: {},
                config,
            };
            if(config.url.match(/lookup.json/)) {
                resp.data = [
                    {
                        id_str: '19998765',
                        name: 'Da Real Donald Jump',
                        screen_name: 'realDonaldJump',
                    },
                ];
                resolve(resp);
            } else {
                reject(new Error('unknown request'));
            }
        });

        const data = [
            {
                created_at: 'Sat Apr 02 09:40:00 +0000 2016',
                id_str: '992384786618748719',
                text: 'Hello, World!',
                user: {
                    id_str: '99998876',
                    screen_name: 'TheAuthor',
                    name: 'The Author',
                    profile_image_url_https: 'https://path.to/picture',
                },
            },
            {
                created_at: 'Sat Apr 02 09:50:00 +0000 2016',
                id_str: '992384786618748720',
                text: 'Immage!',
                user: {
                    id_str: '99998876',
                    screen_name: 'TheAuthor',
                    name: 'The Author',
                    profile_image_url_https: 'https://path.to/picture',
                },
                entities: {
                    media: [{
                        type: 'photo',
                        sizes: {
                            medium: { h: 238, resize: 'fit', w: 226 },
                        },
                        url: 'http://path.to/image',
                        media_url_https: 'https://path.to/media',
                    }],
                },
            },
        ].map(JSON.stringify).join('\n');
        sinon.stub(client, 'stream', () => Promise.resolve(new StringReadable(data)));
    });

    after(() => {
        delete client.defaults.adapter;
        client.stream.restore();
    });

    it.skip('works', async function() {
        let daemon = new Twitter(event.id, {
            hashtags: ['MakeAmericaLateAgain'],
            users: ['realdonaldjump'],
        });

        await new Promise((resolve, reject) => {
            daemon.start()
                .on('error', reject)
                .on('close', resolve);
        });

        expect(client.defaults.adapter).to.have.been.calledOnce;
        expect(client.defaults.adapter.firstCall.args[2])
            .to.have.deep.property('params.screen_name').which.equal('realdonaldjump');

        expect(client.stream).to.have.been.calledOnce;
        expect(client.stream.firstCall.args[0])
            .to.have.deep.property('params.follow').which.equal('19998765');
        expect(client.stream.firstCall.args[0])
            .to.have.deep.property('params.track').which.equal('MakeAmericaLateAgain');

        let ticks = await event.getTicks();
        let first = _.find(ticks, x => x.data.url.match(/992384786618748719/));
        expect(first).to.be.ok;

        first = first.toJSON();
        expect(first.data).to.containSubset({
            rel: 'TEXT',
            title: 'Hello, World!',
            url: 'https://twitter.com/TheAuthor/status/992384786618748719',
            author: 'The Author',
            authorImage: 'https://path.to/picture',
            section: '@TheAuthor',
            createdAt: new Date('Sat Apr 02 09:40:00 +0000 2016'),
        });

        let second = _.find(ticks, x => x.data.url.match(/992384786618748720/));
        expect(second).to.be.ok;

        second = second.toJSON();
        expect(second.data).to.containSubset({
            rel: 'IMAGE',
            image: 'https://path.to/media',
            dimensions: { width: 226, height: 238 },
            title: 'Immage!',
            url: 'https://twitter.com/TheAuthor/status/992384786618748720',
            author: 'The Author',
            authorImage: 'https://path.to/picture',
            section: '@TheAuthor',
            createdAt: new Date('Sat Apr 02 09:50:00 +0000 2016'),
        });
    });
});
