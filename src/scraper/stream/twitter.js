import _ from 'lodash';
import JSONParser from 'jsonparse';
import { ScraperDaemon } from './base';
import { client, oauthOptions } from './client';
import { logger } from '../../utils';
import { PostData } from '../../models/post-data';


const TAG = 'scraper-passive-twitter';

export class Twitter extends ScraperDaemon {
    get TAG() {
        return TAG;
    }

    async resolveScreenNames(users) {
        if (!users.length)
            return [];

        logger.info(this.TAG, 'Resolving screen names');

        try {
            // TODO: switch to post request
            let { data } = await client.get('https://api.twitter.com/1.1/users/lookup.json', {
                params: {
                    screen_name: users.join(','),
                },
                oauth: oauthOptions,
            });

            if (data.length !== users.length)
                logger.warning(this.TAG, `Found ${data.length} out of ${users.length} users`);
            else
                logger.info(this.TAG, `Found all ${data.length} user(s)`);

            return data.map(x => x.id_str);

        } catch (err) {
            console.log(require('util').inspect(err, { depth: null }));
            if (!(err instanceof Error) && err.status === 404) {
                logger.warning(this.TAG, 'No user found');
                return [];

            } else {
                throw err; // TODO: rate limiting errors
            }
        }
    }

    async processPost(raw) {
        console.log(raw);

        let image = _.get(raw, 'entities.media[0]');
        if (image && image.type !== 'image')
            image = null;

        console.log({
            // TODO: special
            rel: image ? PostData.IMAGE : PostData.TEXT,

            dimensions: image ? {
                width: image.sizes.medium.w,
                height: image.sizes.medium.h,
            } : null,
            image: image ? image.media_url_https : null,

            title: raw.text,

            url: `https://twitter.com/${raw.user.screen_name}/status/${raw.id_str}`,

            site: 'Twitter',
            siteImage: null, // TODO
            section: `@${raw.user.screen_name}`,
            author: raw.user.name,
            authorImage: raw.user.profile_image_url_https,
            createdAt: new Date(raw.created_at),
        });
    }

    async run() {
        logger.info(this.TAG, `Starting Twitter scraper for event #${this.event.id}`);

        let { hashtags, users } = this.config;

        let userIds = await this.resolveScreenNames(users);

        if (!userIds.length && !hashtags.length)
            throw new Error('nothing to scrap');

        let stream = await client.stream({
            url: 'https://stream.twitter.com/1.1/statuses/filter.json',
            params: {
                follow: userIds.join(','),
                track: hashtags.join(','),
            },
            oauth: oauthOptions,
        });
        logger.info(this.TAG, 'Connected to streaming endpoint');

        await new Promise((resolve, reject) => {
            let self = this;
            let errorHandler = err => {
                reject(err);
                stream.close();
            };

            let parser = new JSONParser();
            parser.onError = errorHandler;
            parser.onValue = function(value) {
                if (this.stack.length === 0) {
                    self.processPost(value)
                        .catch(errorHandler); // async
                }
            };

            stream.on('error', errorHandler);
            stream.on('abort', resolve);
            stream.on('end', resolve);
            stream.on('data', chunk => {
                parser.write(chunk);
            });
        });

        logger.info(this.TAG, 'Connection closed');
    }
}
