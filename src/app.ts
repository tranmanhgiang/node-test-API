import passport from 'passport';

import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compress from 'compression';
import { responseError } from './helpers/response';
import httpErrorHandler from './helpers/httpErrorHandler';
import NotFoundError from './commons/http-errors/NotFoundError';
import { Environment } from '../config/env';
import routes from './routes';
import { passportConfiguration } from './lib/passports';
import requestValidationHandler from './helpers/requestValidationHandler';
import RequestLogger from './helpers/logger';
import messages from './commons/messages';
import './helpers/time';

class App {
    public app: Application;
    public port: number;
    private apiPrefix = '/api/v1';

    constructor(appInit: { port: number; middleWares: any }) {
        this.app = express();
        this.port = appInit.port;
        this.assets();
        this.middlewares(appInit.middleWares);
        this.initPassport();
        this.initRoutes();
        this.handleError();
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void }) {
        middleWares.forEach((middleWare) => {
            this.app.use(middleWare);
        });
    }

    private initRoutes() {
        this.app.use(this.apiPrefix, routes);
    }

    private assets() {
        if (process.env.NODE_ENV === Environment.Production) {
            this.app.use(compress());
            this.app.use(helmet());
        }
        this.app.use(
            cors({
                origin: process.env.NODE_ENV === Environment.Production ? process.env.SERVERS_ORIGIN : true,
                optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
            })
        );
    }

    private initPassport() {
        // configure passport for authentication
        passportConfiguration(passport);
        this.app.use(passport.initialize());
    }

    public listen() {
        this.app.listen(this.port, () => {
            // eslint-disable-next-line
            console.log(`App listening on the port ${this.port}`);
        });
    }

    private handleError() {
        // Handle common errors
        if (process.env.NODE_ENV === Environment.Development) {
            this.app.use(RequestLogger());
        }
        this.app.use((_req, _res, next) => {
            next(new NotFoundError(messages.generalMessage.ApiNotExist));
        });
        this.app.use(requestValidationHandler);
        this.app.use(httpErrorHandler);
        this.app.use((_error: Error, _req: express.Request, res: express.Response) => {
            responseError(res);
        });
    }
}

export default App;
