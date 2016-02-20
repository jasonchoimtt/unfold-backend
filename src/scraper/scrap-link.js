import { queue, nodeify } from './queue';


queue.process('Scrap Link', nodeify(async function(job) {
    console.log('It scraps!');
}));
