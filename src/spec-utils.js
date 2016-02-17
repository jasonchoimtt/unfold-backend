import axios from 'axios';
import { app } from './';


/**
 * Hooks to initiate the test server.
 */
const port = process.env.PORT || 3001;
const ip = process.env.IP || '0.0.0.0';
let server = null;

before(function() {
    return new Promise((resolve, reject) => {
        server = app.listen(port, ip);
        server.on('listening', resolve);
        server.on('error', reject);
    });
});

after(function() {
    return new Promise((resolve, reject) => {
        server.close(err => {
            if (err) reject(err);
            else resolve();
        });
    });
});

/**
 * Axios instance for test server endpoints.
 */
export const request = axios.create({
    baseURL: `http://${ip}:${port}/`,
});
