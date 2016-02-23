import { Dispatcher } from './base';
import { client } from '../common/facebook';


export const dispatcher = new Dispatcher();

dispatcher.use('//(www.)?facebook.com/:profile/posts/:id', async function(ctx, job) {
    let profile = await client.get(`${ctx.params.profile}`, {
        params: {
            fields: 'id,name,username,link,picture',
        },
    }).backoff().data();

    let post = await client.get(`${profile.id}_${ctx.params.id}`, {
        params: {
            fields: 'id,created_time,message,object_id,' +
                    'link,name,caption,description,picture',
        },
    }).backoff().data();

    console.log({
        content: post.message,
        image: post.object_id, // TODO
        url: `https://www.facebook.com/${profile.id}_${ctx.params.id}`,

        site: 'Facebook',
        source: profile.username,
        author: {
            name: profile.name,
            url: profile.link,
            avatar: profile.picture.data.url,
        },
        createdAt: post.created_time,
    });
});
