import redis from 'redis';
import { Config } from '../config';
import { logger } from '../utils';


export function createClient() {
    let client = redis.createClient({
        url: Config.redis,
    });

    client.on('error', err => {
        logger.error('redis', err.stack || err);
    });

    return client;
}

