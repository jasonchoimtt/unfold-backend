import crypto from 'crypto';
import urllib from 'url';
import _ from 'lodash';
import { fromCallback } from '../../utils';


const randomBytes = fromCallback(crypto, 'randomBytes');

export function encodeData(data) {
    if (!data)
        return '';

    return encodeURIComponent(data)
        .replace(/\!/g, '%21')
        .replace(/\'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}

function sign(method, url, paramList, secret) {
    let paramStr = paramList.map(([k, v]) => `${k}=${v}`).join('&');

    let baseString = [method.toUpperCase(), url, paramStr]
        .map(encodeData)
        .join('&');

    return crypto.createHmac('sha1', secret).update(baseString).digest('base64');
}

export async function createOAuthHeader(request, options) {
    let { url, method } = request;
    if (!method)
        method = 'GET';

    let params = _.extend({}, request.params);

    let { consumerKey, consumerSecret, accessToken, accessTokenSecret, oauthParams } = options;

    oauthParams = _.extend(oauthParams, {
        'oauth_consumer_key': consumerKey,
        'oauth_timestamp': Math.floor(new Date().getTime() / 1000),
        'oauth_nonce': (await randomBytes(32)).toString('base64')
            .replace(/=/g, 'a').replace(/\//g, 'b'),
        'oauth_version': '1.0',
        'oauth_signature_method': 'HMAC-SHA1',
    });

    if (accessToken)
        oauthParams['oauth_token'] = accessToken;

    // Add ?query=string to params too
    let parsedUrl = urllib.parse(url, true);
    _.forEach(parsedUrl.query, (v, k) => { params[k] = v; });

    let paramList = _.chain(oauthParams)
        .toPairs()
        .concat(_.flatMap(params, (v, k) => [].concat(v).map(x => [k, x])))
        .map(pair => pair.map(encodeData))
        .sortBy()
        .value();

    let key = encodeData(consumerSecret) + '&' + encodeData(accessTokenSecret);

    let signature = sign(method, url, paramList, key);

    oauthParams['oauth_signature'] = signature;

    let oauthHeader = _.chain(oauthParams)
        .toPairs()
        .sortBy()
        .map(([k, v]) => `${encodeData(k)}="${encodeData(v)}"`)
        .join(',')
        .value();

    return `OAuth ${oauthHeader}`;
}
