import { Dispatcher } from './base';
import { fromCallback } from '../../utils';
import { iframely } from '../iframely';


export const dispatcher = new Dispatcher();

dispatcher.use('//:domain+/:path*', async function(ctx, job) {
    let results = await fromCallback(iframely.run.bind(iframely))(ctx.url);
    job.log(results);
    console.log(JSON.stringify(results, null, 2));
});
