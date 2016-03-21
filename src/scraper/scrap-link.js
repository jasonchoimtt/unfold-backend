import { queue, nodeify } from './queue';
import { dispatcher } from './active';


queue.process('Scrap Link', nodeify(async function(job) {
    console.log('Scrapping', job.data.url);
    try {
        let result = await dispatcher.dispatch(job.data.url, job);
        console.log(result);
        return result;
    } catch (err) {
        console.log(err.stack || err);
        throw err;
    }
}));
