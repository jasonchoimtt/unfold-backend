import url from 'url';
import _ from 'lodash';


let services = url.parse(process.env.DOCKER_HOST || '').hostname || '127.0.0.1';

let defaultAppEnv = 'rest, websocket, scraper, admin';

export const Config = {
    appEnv: (process.env.APP_ENV || defaultAppEnv).split(',').map(x => x.trim()),
    ip: process.env.IP || '0.0.0.0',
    port: process.env.PORT || '3000',

    database: process.env.DATABASE_URL || `postgres://unfold:unfold_icup@${services}:5432/unfold`,
    redis: process.env.REDIS_URL || `redis://${services}:6379/`,

    jwtKey: process.env.JWT_KEY || 'unfold_development_key',
    jwtOptions: {
        algorithm: 'HS256',
        expiresIn: '365 days', // for testing
    },

    accessControl: {
        allowOrigin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN || '*',
        maxAge: process.env.ACCESS_CONTROL_MAX_AGE || 604800, // 1 week
    },

    facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
    },

    twitter: {
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        // TODO: eventually remove access token
        accessToken: process.env.TWITTER_ACCESS_TOKEN,
        accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    },

    // Azure DataMarket, for Microsoft Translator API
    dataMarket: {
        clientId: process.env.DATA_MARKET_CLIENT_ID,
        clientSecret: process.env.DATA_MARKET_CLIENT_SECRET,
    },

    testMode() {
        this.ip = process.env.TEST_IP || '127.0.0.1';
        this.port = process.env.TEST_PORT || 3001;
        this.appEnv = ['rest', 'websocket'];
        if (!process.env.LOG_LEVEL)
            this.logLevel = 'WARNING';

        process.env.NODE_ENV = 'testing';
    },

    logLevel: process.env.LOG_LEVEL || 'INFO',
};

try {
    let ConfigLocal = require('./config.local').Config;
    _.extend(Config, ConfigLocal);
} catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND')
        throw err;
}
