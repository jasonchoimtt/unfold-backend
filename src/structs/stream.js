import { fromCallback } from '../utils';
import { createClient } from './redis';


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
            this.subscriptions[channel].forEach(fn => {
                fn(message);
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

        let index = this.subscriptions[channel].indexOf(fn);
        if (index === -1)
            return false;

        this.subscriptions[channel].splice(index, 1);

        if (!this.subscriptions[channel].length) {
            fromCallback(this.redis, 'unsubscribe')(channel)
                .then(() => {
                    if (!this.subscriptions[channel].length)
                        delete this.subscriptions[channel];
                    // TODO: fix race condition
                }); // async
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

    /*promise*/ publish(channel, message) {
        return fromCallback(this.redis, 'publish')(channel, message);
    },
};

export const Channels = {
    event(id) {
        return `event_${id}`;
    },

    eventTick(id) {
        return `event_${id}_ticks`;
    },
};
