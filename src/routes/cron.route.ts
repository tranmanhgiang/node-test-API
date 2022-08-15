import express from 'express';
import CronController from '../controllers/cron.controller';
import wrap from '../helpers/wrap';
import userModel from '../models/user.model';

const router = express.Router();
const userController = new CronController(userModel);

router.get('/logger', wrap(userController.logEveryMinute));

export default router;
