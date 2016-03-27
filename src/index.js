/**
 * Global bootstrapping.
 * Modules are loaded using the environmental variable APP_ENV.
 */
if (process.env.NODE_ENV !== 'production')
    require('source-map-support/register');

import express from 'express';
import http from 'http';
import _ from 'lodash';
import { logger } from './utils';
import { Config } from './config';
import { errorHandler } from './errors';


const TAG = 'app';

/**
 * Start the services specified in Config.appEnv.
 */
export function main(options) {
    let serverComponents = _.intersection(Config.appEnv, ['rest', 'admin', 'websocket']);
    let server;
    if (serverComponents.length) {
        let app = express();
        app.set('x-powered-by', false);
        app.set('trust proxy', true);

        // REST API app
        if (Config.appEnv.indexOf('rest') !== -1)
            app.use(require('./routes').app);

        // Admin app
        if (Config.appEnv.indexOf('admin') !== -1)
            app.use(require('./admin').app);

        app.use(errorHandler);


        server = http.createServer(app);

        // WebSocket app
        if (Config.appEnv.indexOf('websocket') !== -1)
            require('./websocket').app.attach(server);


        // Listen
        let { port, ip } = Config;
        server.listen(port, ip, function() {
            let mode = process.env.NODE_ENV === 'production'
                            ? 'production' : 'development';

            if (!options || !options.silent) {
                logger.info(TAG, `App listening in ${mode} on ${ip}:${port}`);
                logger.info(TAG, `Components loaded: ${serverComponents.join(', ')}`);
            }
        });
    }

    if (Config.appEnv.indexOf('scraper') !== -1) {
        if (!options || !options.silent)
            logger.info(TAG, 'Loading component: scraper');

        require('./scraper');
    }

    return { server };
}

if (require.main === module)
    main();
