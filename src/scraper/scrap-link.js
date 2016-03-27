import { queue, nodeify } from '../structs/queue';
import { dispatcher } from './active';
import { Post, Tick } from '../models';


queue.process('Scrap Link', nodeify(async function(job) {
    job.log('Scrapping', job.data.url);
    try {
        let result = await dispatcher.dispatch(job.data.url, job);
        job.log(result);
        if (job.data.postId || job.data.tickId) {
            job.log('Saving result to database');
            let obj;
            if (job.data.postId)
                obj = Post.build({ id: job.data.postId }, { isNewRecord: false });
            else
                obj = Tick.build({ id: job.data.tickId }, { isNewRecord: false });

            obj = await obj.update({
                data: result,
            });
        }
        return result;

    } catch (err) {
        job.log(err.stack || err);
        throw err;
    }
}));
