import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'express-validation';
import { logger } from './logger';
import { responseError } from './response';

export default (error: ValidationError, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof ValidationError) {
        logger.error(error);
        // eslint-disable-next-line
        return responseError(res, error.statusCode, error.details.body[0].message.replace(/(\")/g, ''));
    }

    return next(error);
};
