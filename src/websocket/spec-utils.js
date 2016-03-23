import urllib from 'url';
import { client as WebSocketClient } from 'websocket';


let closeToken = {}; // Singleton for representing connection closed

// TODO: unify this in a sensible location
const port = process.env.PORT || 3001;
const ip = process.env.IP || '0.0.0.0';


export class WebSocketTestClient {
    constructor() {
        this.ws = new WebSocketClient();

        this.queue = [];
        this.queueListener = null;
    }

    /* promise */ connect(url) {

        return new Promise((resolve, reject) => {
            url = urllib.resolve(`http://${ip}:${port}`, url);
            this.ws.connect(url);

            this.ws.on('connect', conn => {
                conn.on('message', message => { this.notify(message); });
                conn.on('error', error => { this.notify(error); });
                conn.on('close', () => { this.notify(closeToken); });

                resolve(conn);
            });

            this.ws.on('connectFailed', reject);
        });
    }

    notify(obj) {
        this.queue.push(obj);

        if (this.queueListener) {
            this.queueListener();
            this.queueListener = null;
        }
    }

    handle(type, obj) {
        if (obj === closeToken) {
            if (type !== 'close') {
                throw new Error(`Connection closed: ${this.conn.closeReasonCode} ` +
                                `${this.conn.closeDescription}`);
            }

        } else if (obj instanceof Error) {
            if (type !== 'error') {
                let err = new Error('Error thrown: ' + (obj.message || obj));
                err.cause = obj;
                throw err;
            }

        } else {
            if (type !== 'message') {
                let err = new Error('Message received: ' + obj.toString());
                err.body = obj;
                throw err;
            }
        }

        return obj;
    }

    async next(type) {
        if (this.queue.length) {
            return this.handle(type, this.queue.shift());

        } else {
            return await new Promise((resolve) => {
                this.queueListener = resolve;
            }).then(() => {
                return this.handle(type, this.queue.shift());
            });
        }
    }

    // async
    nextMessage() { return this.next('message'); }
    nextError() { return this.next('error'); }
    nextClose() { return this.next('close'); }

    async nextString() {
        let msg = await this.nextMessage();
        if (msg.type !== 'utf8') {
            let err = new Error('Non-text message received');
            err.body = msg;
            throw err;
        }
        return msg.utf8Data;
    }

    async nextJSON() {
        let str = await this.nextString();
        try {
            return JSON.parse(str);
        } catch (err) {
            let err = new Error('Invalid JSON string: ' + str);
            err.body = str;
            throw err;
        }
    }
}
