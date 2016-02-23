import { queue } from './queue';
import _ from 'lodash';


const SEC = 1000;

/**
 * Scrap the provided link and store it to the target database row.
 *
 * Either `postId` or `tickId` must be provided.
 *
 * @param {Object} job
 * @param {String} job.url the link to scrap
 * @param {String} [job.postId] ID of the target post
 * @param {String} [job.tickId] ID of the target tick
 */
export function ScrapLink(job) {
    return queue.create('Scrap Link', _.extend(job, {
        title: job.url,
    }))
        .attempts(5).backoff({
            delay: 60 * SEC,
            type: 'exponential',
        })
        .ttl(60 * SEC);
}
