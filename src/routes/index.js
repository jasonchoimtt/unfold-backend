import express from 'express';

import { authMiddleware } from '../auth';
import { router as authRouter } from './auth';
import { router as eventRouter } from './event';
import { router as userRouter } from './user';


export const router = express.Router();

router.use('/', authMiddleware);

router.use('/auth', authRouter);
router.use('/event', eventRouter);
router.use('/user', userRouter);

router.use('/', function(req, res) {
    res.json({ message: 'It works!' });
});
