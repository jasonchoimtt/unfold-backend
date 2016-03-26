import _ from 'lodash';
import repl from 'repl';

import * as jobs from '../structs/jobs';
import { kue, queue } from '../structs/queue';


export { jobs, kue, queue };


if (require.main === module) {
    let cli = repl.start('scraper> ');


    _.extend(cli.context, {
        jobs, kue, queue,
        lodash: _,
        run: () => {
            require('./');
        },
    });
}
