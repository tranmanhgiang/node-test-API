import express from 'express';
import userRoutes from './user.route';
import cronRoutes from './cron.route';
import { getRootFilePath } from '../helpers/file';
import env from '../../config/env';

const router = express.Router();

router.get('/health-check', (_req, res) => {
    res.send('NODE API OK');
});

router.use('/user', userRoutes);
router.use('/cron', cronRoutes);
router.use('/app', (_req, res) => {
    res.sendFile(getRootFilePath(env.fileRootAPK, `Node.apk`));
});

export default router;
