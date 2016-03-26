import redis from 'redis';
import { Config } from '../config';


export function createClient() {
    let client = redis.createClient({
        url: Config.redis,
    });

    client.on('error', err => {
        console.error(err.stack || err);
    });

    return client;
}

