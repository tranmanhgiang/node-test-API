import passportJWT from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { PassportStatic } from 'passport';
import env from '../../config/env';
import { UserAttributes } from '../interfaces/user';
import customerModel from '../models/user.model';
import { USER_STATUS } from '../commons/constants';
import UnauthorizedError from '../commons/http-errors/UnauthorizedError';
import messages from '../commons/messages';

const { ExtractJwt } = passportJWT;
const JwtStrategy = passportJWT.Strategy;

export function passportConfiguration(passport: PassportStatic) {
    const opts: passportJWT.StrategyOptions = {
        secretOrKey: env.jwtSecret,
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Bearer'),
    };

    passport.use(
        new JwtStrategy(opts, async (jwtPayload, cb) => {
            const user = await customerModel.findOne({
                where: { id: jwtPayload.id, isActivated: true, deleted: false },
            });
            if (user) {
                if (user.status === USER_STATUS.DEACTIVATED) {
                    cb(new UnauthorizedError(messages.httpMessages[401]), false);
                }
                cb(null, user);
            } else {
                cb(new Error('Something wrong in token'), false);
            }
        })
    );
}

export function generateToken(customer: UserAttributes) {
    return jwt.sign({ id: customer.id, email: customer.email, userRole: customer.userRole }, env.jwtSecret, {
        expiresIn: env.jwtExpiresIn,
    });
}
