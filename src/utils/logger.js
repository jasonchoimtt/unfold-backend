import os from 'os';
import util from 'util';
import _ from 'lodash';
import moment from 'moment';

import { Config } from '../config';


const facility = 1; // user
const hostname = os.hostname();


export const logger = {
    write(...args) {
        console.log(...args);
    },
    log(level, tag, ...messages) {
        if (!_.findKey(logger.levels, x => x === level)) {
            logger.warning('logging', `Invalid log level specified: ${level}`);
            level = logger.levels.WARNING;
        }

        if (tag.indexOf(' ') !== -1)
            logger.warning('logging', `Invalid tag: ${tag}`);

        if (level <= logger.logLevel) {
            // Use a syslog-ish formatting
            let priority = facility * 8 + level;
            let date = moment().format('MMM D HH:mm:ss');
            let left = `<${priority}> ${date} ${hostname} ${tag}: `;
            let out = messages
                .map(x => {
                    if (typeof x === 'string')
                        return x;
                    if (x instanceof Error && x.stack)
                        return x;
                    return util.inspect(x, { depth: 5 });
                })
                .join(' ')
                .split('\n')
                .map(x => left + x)
                .join('\n');

            logger.write(out);
        }
    },
    levels: {
        // Syslog-ish levels
        DEBUG: 7,
        INFO: 6,
        NOTICE: 5,
        WARNING: 4,
        ERROR: 3,
        CRITICAL: 2,
        ALERT: 1,
        EMERGENCY: 0,
        SILENT: -1, // Only for setting log level
    },
    get logLevel() {
        let level = logger.levels[Config.logLevel.toUpperCase()];
        return typeof level !== 'undefined'
                ? level
                : logger.INFO;
    },
};

_.extend(logger, logger.levels);

_.forEach(logger.levels, (level, key) => {
    logger[key.toLowerCase()] = logger.log.bind(logger, level);
});

/**
 * Decorator to call the async function asynchronously (i.e. does not return a
 * promise) and catch the error to the logger.
 */
export function catchToLog(tag) {
    return function(fn) {
        return function(...args) {
            fn(...args)
                .catch(logger.error.bind(logger, tag));
        };
    };
}
