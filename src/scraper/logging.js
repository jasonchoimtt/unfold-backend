import { Job } from 'kue';
import { fromCallback, logger } from  '../utils';
import { queue } from '../structs/queue';


const TAG = 'kue-jobs';

queue.on('job failed attempt', (id, msg, attempts) => {
    logger.notice(TAG, `Job ${id} attempt #${attempts} failed: ${msg}`);
});

queue.on('job failed', (id, msg) => {
    fromCallback(Job, 'log')(id)
        .then(log => {
            logger.warning(TAG, `Job ${id} permanently failed: ${msg}\n`, log);
        })
        .catch(err => {
            logger.warning(TAG, `Job ${id} permanently failed: ${msg}`);
            logger.warning(TAG, `Additionally, its log failed to load`);
        });
});

queue.on('job complete', (id, result) => {
    logger.notice(TAG, `Job ${id} completed\n`, result);
});
