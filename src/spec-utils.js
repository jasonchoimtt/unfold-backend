import util from 'util';
import axios from 'axios';
import { app } from './';


const port = process.env.PORT || 3001;
const ip = process.env.IP || '0.0.0.0';
let server = null;
let serverPromise = null;

/**
 * Runs the singleton test server.
 *
 * There is currently no way to stop it!
 */
export function runApp() {
    if (!server) {
        serverPromise = new Promise((resolve, reject) => {
            server = app.listen(port, ip);
            server.on('listening', resolve);
            server.on('error', reject);
        });
    }

    return serverPromise;
}

/**
 * Axios instance for test server endpoints.
 */
export const request = axios.create({
    baseURL: `http://${ip}:${port}/`,
});

/**
 * Wraps a Promise function to Jasmine-style spec.
 */
export function wait(fn) {
    return function(done) {
        fn().then(done, err => {
            // Axios throws non-200 requests too, so we have to take this as a
            // special case to get meaningful error messages
            if (err.status) {
                done.fail(new Error(`${err.status} ${err.statusText}: ${err.data}\n` +
                                    `${util.inspect(err.headers)}`));
            } else {
                done.fail(err);
            }
        });
    };
}
