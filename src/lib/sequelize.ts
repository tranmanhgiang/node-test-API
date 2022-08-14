import { Sequelize, Dialect } from 'sequelize';
import env from '../../config/env';
import { logger } from '../helpers/logger';

const { database } = env;

export default new Sequelize(database.database, database.username, database.password, {
    dialect: database.dialect as Dialect,
    host: database.host,
    port: database.port,
    logging: database.logging && logger.debug.bind(logger),
    // dialectOptions: { ...database.dialectOptions, decimalNumbers: true },
    retry: { max: 3 },
    pool: { max: 50 },
}) as Sequelize;
