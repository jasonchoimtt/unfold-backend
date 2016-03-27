import { Dispatcher } from './base';
import { client } from '../common/facebook';
import { PostData } from '../../models/post-data';


export const dispatcher = new Dispatcher();

dispatcher.use('//(www.)?facebook.com/:profile/posts/:id', async function(ctx, job) {
    job.log('Scraper: Facebook post');

    job.log('Scraping author profile');
    let profile = await client.get(`${ctx.params.profile}`, {
        params: {
            fields: 'id,name,username,link,picture',
        },
    }).backoff().data();

    job.log('Scraping post');
    let post = await client.get(`${profile.id}_${ctx.params.id}`, {
        params: {
            fields: 'id,created_time,message,object_id,' +
                    'link,name,caption,description,picture',
        },
    }).backoff().data();

    return {
        rel: PostData.TEXT, // TODO

        // TODO: dimensions
        image: post.object_id, // TODO
        title: post.message,

        url: `https://www.facebook.com/${profile.id}_${ctx.params.id}`,

        site: 'Facebook',
        // TODO: siteImage
        section: profile.username,
        author: profile.name,
        authorImage: profile.picture.data.url,
        createdAt: post.created_time,
    };
});
