import redislib from 'redis';

import { fromCallback } from './utils';
import { Config } from './config';


export function createClient() {
    let redis = redislib.createClient({
        url: Config.redis,
    });

    redis.on('error', err => {
        console.error(err.stack || err);
    });

    return redis;
}

export const Subscriber = {
    subscriptions: {},

    get redis() {
        if (!this._redis) {
            this._redis = createClient();
            this._redis.on('message', this.onMessage.bind(this));
        }

        return this._redis;
    },

    onMessage(channel, message) {
        if (this.subscriptions[channel]) {
            let data = JSON.parse(message);
            this.subscriptions[channel].forEach(fn => {
                fn(data);
            });
        }
    },

    /*promise*/ subscribe(channel, fn) {
        if (this.subscriptions[channel]) {
            this.subscriptions[channel].push(fn);
            return Promise.resolve();

        } else {
            return fromCallback(this.redis, 'subscribe')(channel)
                .then(() => {
                    // Avoid race condition
                    this.subscriptions[channel] = this.subscriptions[channel] || [];
                    this.subscriptions[channel].push(fn);
                });
        }
    },

    unsubscribe(channel, fn) {
        if (!this.subscriptions[channel])
            return false;

        let index = this.subscriptions.indexOf(fn);
        if (index === -1)
            return false;

        this.subscriptions[channel].splice(index, 1);

        if (!this.subscriptions[channel].length) {
            this.redis.unsubscribe(channel); // async
        }

        return true;
    },

    EVENT: 'event_',
};

export const Publisher = {
    get redis() {
        if (!this._redis)
            this._redis = createClient();

        return this._redis;
    },

    /*promise*/ publish(channel, data) {
        return fromCallback(this.redis, 'publish')(channel, JSON.stringify(data));
    },
};

export const Channels = {
    event(id) {
        return `event_${id}`;
    },
};
