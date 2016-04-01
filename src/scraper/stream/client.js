import https from 'https';
import urllib from 'url';
import Buffer from 'buffer';
import _ from 'lodash';
import axios from 'axios';
import { createOAuthHeader, encodeData } from './oauth-utils';
import { Config } from '../../config';


export const oauthOptions = {
    consumerKey: Config.twitter.consumerKey,
    consumerSecret: Config.twitter.consumerSecret,
    accessToken: Config.twitter.accessToken,
    accessTokenSecret: Config.twitter.accessTokenSecret,
};

/**
 * Sends an OAuth-authenticated request.
 * @return {http.ClientRequest}
 * @param {Object} options
 * @param {String} [options.method=GET]
 * @param {String} options.url
 * @param {Object} [options.headers={}]
 */
export async function requestStream(config) {
}

export const client = axios.create();

/**
 * Interceptor for building Authorization header given the OAuth credentials.
 *
 * @param {Object} config
 * @param {Object} config.oauth
 * @param {String} config.oauth.consumerKey
 * @param {String} config.oauth.consumerSecret
 * @param {String} [config.oauth.accessToken]
 * @param {String} [config.oauth.accessTokenSecret]
 */
client.interceptors.request.use(async function signOAuthRequest(config) {
    if (config.oauth) {
        let oauthHeader = await createOAuthHeader(config, config.oauth);

        config.headers = config.headers || {};
        config.headers['Authorization'] = oauthHeader;
    }
    return config;
});

client.stream = async function stream(config) {
    let oauthHeader = await createOAuthHeader(config, config.oauth);

    // Construct request arguments
    let url = config.baseURL ? urllib.resolve(config.url) : config.url;
    let { protocol, hostname, path } = urllib.parse(url);
    if (protocol !== 'https:')
        throw new Error('only HTTPS is supported');

    let method = (config.method || 'GET').toUpperCase();
    let contentType = _.find(config.headers, (k, v) => v.toLowerCase() === 'Content-Type')
                        || 'application/x-www-form-urlencoded';

    let headers = _.extend({
        'Accept': '*/*',
        'Connection': 'Close',
        'User-Agent': 'Unfold', // TODO: use value from Config
        'Content-Type': contentType,
    }, config.headers);
    headers['Authorization'] = oauthHeader;

    // Construct the content body
    let body = config.data;
    if (['POST', 'PUT', 'PATCH'].indexOf(method) !== -1) {
        if (body && typeof body !== 'string' && !Buffer.isBuffer(body)) {
            if (contentType === 'application/json')
                body = JSON.stringify(body);
            else if (contentType === 'application/x-www-form-urlencoded')
                body = _.map(body, (v, k) => `${encodeData(k)}=${encodeData(v)}`).join('&');
            else
                throw new Error('unknown Content-Type');
        }
    }

    // Params are always added to path
    let question = path.indexOf('?') === -1;
    _.forEach(config.params, (v, k, i) => {
        path += (question ? '?' : '&') + encodeData(k) + '=' + encodeData(v);
        question = false;
    });

    if (!_.findKey(headers, (v, k) => k.toLowerCase() === 'content-length'))
        headers['Content-Length'] = body ? Buffer.byteLength(body) : 0;

    let resolve, reject, promise = new Promise((s, j) => { resolve = s; reject = j; });
    let req = https.request({
        hostname, path, method, headers,
    }, (stream, socket) => {
        // Nowhere else to put this, so...
        stream.close = function close() {
            req.abort();
        };
        resolve(stream);
    });

    req.on('error', reject);

    // Write the body
    if (body) {
        req.setEncoding('utf8');
        req.write(body);
    }

    req.end();

    return promise;
};

// let out = x => {
//     console.log(require('util').inspect(x, { depth: null }));
// };

// client.get('https://api.twitter.com/1.1/users/lookup.json', {
//     params: {
//         screen_name: 'angularjs',
//     },
//     oauth: oauthOptions,
// }).then(out, out);
