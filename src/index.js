/**
 * Entry point for the main Node.js app.
 */
if (process.env.NODE_ENV !== 'production')
    require('source-map-support/register');

import express from 'express';

import { router } from './routes';
import { errorHandler } from './errors';
import { router as scraperAdmin } from './scraper/admin';


export const app = express();

app.set('x-powered-by', false);
app.set('trust proxy', true);

app.use('/api', router);

app.use('/admin/kue', scraperAdmin);

app.use(errorHandler);


if (require.main === module) {
    let port = process.env.PORT || 3000;
    let ip = process.env.IP || '0.0.0.0';

    app.listen(port, ip, function() {
        let mode = process.env.NODE_ENV === 'production'
                        ? 'production' : 'development';
        console.log("App listening in " + mode + " on " + ip + ":" + port);
    });

    // Start the scraper on the same process for now
    require('./scraper');
}
