import kue from 'kue';

import { Config } from '../config';
import { logger } from '../utils';


export const queue = kue.createQueue({
    redis: Config.redis,
});

queue.on('error', err => {
    logger.error('kue', err.stack || err);
});

export { kue };

export function nodeify(fn) {
    return function(job, done) {
        let ret = fn(job);
        if (ret && typeof ret.then !== 'undefined' && typeof ret.catch !== 'undefined')
            ret.then(result => { done(null, result); }, err => { done(err); });
    };
}
