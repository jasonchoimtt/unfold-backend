import express from 'express';

import { authMiddleware } from '../auth';
import { router as authRouter } from './auth';
import { router as eventRouter } from './event';


export const router = express.Router();

router.use('/', authMiddleware);

router.use('/auth', authRouter);
router.use('/event', eventRouter);

router.use('/', function(req, res) {
    res.json({ data: 'It works!' });
});
