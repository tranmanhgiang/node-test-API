import { Response } from 'express';
import httpStatus from 'http-status';
import messages from '../commons/messages';

function returnObject(success = true, code: number, message = '', data = null) {
    return {
        success,
        code,
        message,
        data,
    };
}

function responseData(res: Response, httpCode: number, success = true, message = '', data = null) {
    return res.json(returnObject(success, httpCode, message, data));
}

export function responseError(
    res: Response,
    code = httpStatus.INTERNAL_SERVER_ERROR,
    message: string = messages.generalMessage.Error,
    data = null
) {
    return responseData(res, code, false, message, data);
}

export function responseSuccess(res: Response, data?: any) {
    return responseData(res, httpStatus.OK, true, messages.generalMessage.success, data);
}
