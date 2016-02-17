import express from 'express';

import { authMiddleware } from '../auth';
import { router as authRouter } from './auth';


export const router = express.Router();

router.use('/', authMiddleware);

router.use('/auth', authRouter);

router.use('/', function(req, res) {
    res.json({ data: 'It works!' });
});
