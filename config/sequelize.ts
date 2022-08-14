import config from './env';

const createSequelizeConfigForEnv = (environment) => {
    /* eslint-disable global-require */
    switch (environment) {
        case 'production': {
            return {
                production: config.database,
            };
        }
        case 'qa': {
            return {
                qa: config.database,
            };
        }
        case 'uat': {
            return {
                uat: config.database,
            };
        }
        default: {
            return {
                development: config.database,
            };
        }
    }
};

// Needs to be `module.exports` as required by Sequelize CLI
// http://docs.sequelizejs.com/manual/migrations.html#configuration
module.exports = createSequelizeConfigForEnv(process.env.NODE_ENV);
