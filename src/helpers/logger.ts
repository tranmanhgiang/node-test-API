import winston from 'winston';
import expressWinston from 'express-winston';
import config, { Environment } from '../../config/env';

const createLoggerForEnv = (environment) => {
    let logger;
    switch (environment) {
        case Environment.Development:
            logger = winston.createLogger({});
            logger.level = 'debug';
            logger.add(
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.colorize(), winston.format.simple(), winston.format.align()),
                })
            );
            break;

        case Environment.Qa:
            logger = winston.createLogger({});
            logger.level = 'debug';
            logger.add(
                new winston.transports.Console({
                    format: winston.format.simple(),
                    silent: process.env.ENABLE_TEST_LOGGING !== 'true',
                })
            );
            break;
        case Environment.Uat:
            logger = winston.createLogger({});
            logger.level = 'debug';
            logger.add(
                new winston.transports.Console({
                    format: winston.format.simple(),
                    silent: process.env.ENABLE_TEST_LOGGING !== 'true',
                })
            );
            break;
        case Environment.Production:
            logger = winston.createLogger({});
            logger.level = 'info';
            logger.add(
                new winston.transports.Console({
                    format: winston.format.combine(winston.format.timestamp(), winston.format.simple(), winston.format.align()),
                })
            );
            break;
    }
    return logger;
};

export const logger = createLoggerForEnv(config.environment);

export default function RequestLogger() {
    expressWinston.requestWhitelist.push('body');
    expressWinston.responseWhitelist.push('body');

    return expressWinston.logger({
        winstonInstance: logger,
        colorize: true,
    });
}
