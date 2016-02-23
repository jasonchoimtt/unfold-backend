import url from 'url';
import _ from 'lodash';


let ip = url.parse(process.env.DOCKER_HOST || '').hostname || '127.0.0.1';

export const Config = {
    database: `postgres://unfold:unfold_icup@${ip}:5432/unfold`,
    redis: `redis://${ip}:6379/`,

    jwtKey: 'unfold_development_key',
    jwtOptions: {
        algorithm: 'HS256',
        expiresIn: '15m',
    },

    facebook: {},
};

try {
    let ConfigLocal = require('./config.local').Config;
    _.extend(Config, ConfigLocal);
} catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND')
        throw err;
}
