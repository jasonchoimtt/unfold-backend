import _ from 'lodash';

const iframelyVersion = require('iframely/package.json').version;

const iframelyConfig = {
    // Disable logging to iframely server
    WHITELIST_LOG_URL: null,

    CACHE_ENGINE: 'no-cache',

    USER_AGENT: `Iframely/${iframelyVersion} (+http://iframely.com/;) Unfold`,
};


// Monkey-patch the config object
GLOBAL.CONFIG = _.extend({}, require('iframely/config'), iframelyConfig);

export const iframely = require('iframely');
