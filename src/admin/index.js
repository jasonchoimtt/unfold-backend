/**
 * Admin app.
 */
import express from 'express';

import { errorHandler } from '../errors';
import { router as kue } from './kue';
import { router as scraper } from './scraper';


// /admin router
const router = express.Router();

router.use('/kue', kue);
router.use('/scraper', scraper);

// Catch-all error handler
router.use(errorHandler);


// The actual app
export const app = express();

app.set('x-powered-by', false);
app.set('trust proxy', true);

app.use('/admin', router);
