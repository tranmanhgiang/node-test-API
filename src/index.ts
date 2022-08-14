import * as bodyParser from 'body-parser';
import App from './app';
import config from '../config/env';

const app = new App({
    port: Number(config.port),
    middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true, limit: '5m' })],
});

app.listen();
