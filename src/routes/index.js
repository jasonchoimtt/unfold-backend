/**
 * REST API app.
 */
import express from 'express';
import { Config } from '../config';

import { authMiddleware } from '../auth';
import { errorHandler } from '../errors';

import { router as authRouter } from './auth';
import { router as eventRouter } from './event';
import { router as userRouter } from './user';


// /api router
const router = express.Router();

router.use('/', authMiddleware);

router.use('/', function accessControl(req, res, next) {
    res.set('Access-Control-Allow-Origin', Config.accessControl.allowOrigin);
    res.set('Access-Control-Max-Age', Config.accessControl.maxAge);
    res.set('Access-Control-Allow-Headers', 'Authorization, Accept, Content-Type');
    res.set('Access-Control-Allow-Methods', 'GET POST PUT PATCH DELETE OPTIONS');
    next();
});

/**
 * Default cache control policy. Private and always revalidate.
 */
router.use('/', function cacheControl(req, res, next) {
    res.set('Cache-Control', 'private, max-age=0');
    next();
});

router.use('/auth', authRouter);
router.use('/event', eventRouter);
router.use('/user', userRouter);

router.get('/', function(req, res) {
    res.json({ message: 'It works!' });
});

// Catch-all error handler
router.use(errorHandler);


// The actual app
export const app = express();

app.set('x-powered-by', false);
app.set('trust proxy', true);

app.use('/api', router);
