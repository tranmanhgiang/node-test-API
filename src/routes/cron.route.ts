import express from 'express';
import CronController from '../controllers/cron.controller';

import wrap from '../helpers/wrap';

const router = express.Router();
const userController = new CronController();

router.get('/logger', wrap(userController.logEveryMinute));

export default router;
