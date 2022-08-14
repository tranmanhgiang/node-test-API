import { NextFunction, Request, Response } from 'express';
import { logger } from './logger';
import HttpError from '../commons/http-errors/HttpError';
import { responseError } from './response';

export default (error: HttpError, _req: Request, res: Response, next: NextFunction) => {
    if (error instanceof HttpError) {
        logger.error(error);
        return responseError(res, error.statusCode, error.message);
    }

    return next(error);
};
