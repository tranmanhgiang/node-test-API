import { Request, Response } from 'express';
import UserRepository from '../repositories/user.repository';

class CronController extends UserRepository {
    /**
     * User Login
     * @param  {Request} req
     * @param  {Response} res
     */
    public logEveryMinute = async (req: Request, res: Response) => {
        // cron.schedule('* * * * *', () => {
        //     console.log('running a task every minute');
        // });
        const users = await this.findUserById(1);
        return res.json(users);
    };
}

export default CronController;
