import url from 'url';
import _ from 'lodash';


let ip = url.parse(process.env.DOCKER_HOST || '').hostname || '127.0.0.1';

export const Config = {
    database: process.env.DATABASE_URL || `postgres://unfold:unfold_icup@${ip}:5432/unfold`,
    redis: process.env.REDIS_URL || `redis://${ip}:6379/`,

    jwtKey: process.env.JWT_KEY || 'unfold_development_key',
    jwtOptions: {
        algorithm: 'HS256',
        expiresIn: '15m',
    },

    facebook: {
        appId: process.env.FACEBOOK_APP_ID,
        appSecret: process.env.FACEBOOK_APP_SECRET,
    },
};

try {
    let ConfigLocal = require('./config.local').Config;
    _.extend(Config, ConfigLocal);
} catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND')
        throw err;
}
