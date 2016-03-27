import _ from 'lodash';
import { Dispatcher } from './base';
import { iframely } from '../iframely';
import { fromCallback } from '../../utils';
import { PostData } from '../../models/post-data';


function rel(post, ...rels) {
    return _.find(post.links, link => _.intersection(link.rel, rels).length && link.href);
}


export const dispatcher = new Dispatcher();

dispatcher.use('//:domain+/:path*', async function(ctx, job) {
    job.log('Scraper: Iframely');
    let result = await fromCallback(iframely.run.bind(iframely))(ctx.url);
    let meta = result.meta;
    job.log('Result from iframely: ', result);

    let image = rel(result, 'image', 'thumbnail');
    let embed = rel(result, 'player', 'app', 'reader', 'survey', 'product', 'summary');
    return {
        // TODO: special
        rel: embed ? PostData.EMBED : image ? PostData.IMAGE : PostData.TEXT,

        dimensions: _.get(embed, 'media') || _.get(image, 'media'),
        image: _.get(image, 'href'),
        embed: _.get(embed, 'href'),

        title: meta.title || meta.description,
        content: meta.title ? meta.description : null,

        url: meta.canonical || ctx.url,
        shortUrl: meta.shortlink,

        site: ctx.hostname,
        siteImage: _.get(rel(result, 'logo', 'icon'), 'href'),
        section: null,
        author: meta.author,
        authorImage: null,
        createdAt: meta.date, // TODO: parse date

        iframely: result,
    };
});
