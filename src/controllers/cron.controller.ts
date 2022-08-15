import { Request, Response } from 'express';
import cron from 'node-cron';

class CronController {
    /**
     * User Login
     * @param  {Request} req
     * @param  {Response} res
     */
    public logEveryMinute = async (req: Request, res: Response) => {
        cron.schedule('* * * * *', () => {
            console.log('running a task every minute');
        });
        return res.send('Job Done!');
    };
}

export default CronController;
