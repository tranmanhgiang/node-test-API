import dotenv from 'dotenv';

export const Environment = {
    Qa: 'qa',
    Production: 'production',
    Development: 'development',
    Uat: 'uat',
};
// Load environment from env file
dotenv.config({
    path: './.env',
});

const poolConfig = {
    max: 100,
    min: 0,
    idle: 20000,
    acquire: 20000,
    evict: 30000,
    handleDisconnects: true,
};

const database = {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD, // if blank then set null
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    pool: process.env.enableConnectionPool ? poolConfig : null,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === Environment.Development,
    port: parseInt(process.env.DB_PORT),
    timezone: '+00:00',
};

export default {
    /**
     * Application environment mode either developement or production or test
     * @type {String}
     */
    environment: process.env.NODE_ENV,
    port: process.env.API_PORT,

    /**
     * Database connection for each environment
     * @type {Object}
     */
    database,

    jwtSecret: process.env.JWT_SECRET,
    jwtExpiresIn: '20d',

    salt: process.env.SALT,

    /**
     * Mail server information
     * @type {Object}
     */
    mailServer: process.env.EMAIL_SERVER,
    mailPort: process.env.EMAIL_PORT,
    mailAuthUserName: process.env.EMAIL_AUTH_USERNAME,
    mailAuthPassword: process.env.EMAIL_AUTH_PASSWORD,
    senderEmail: process.env.SENDER_EMAIL,
    senderName: process.env.SENDER_NAME,

    // The folder storage record files
    fileRootRecord: process.env.FILE_ROOT_RECORD,
    fileRoot: process.env.FILE_ROOT,
    fileRootTemplate: process.env.FILE_ROOT_TEMPLATE,
    fileRootAvatar: process.env.FILE_ROOT_AVATAR,
    fileRootAttachment: process.env.FILE_ROOT_ATTACHMENT,
    fileRootTranscription: process.env.FILE_ROOT_TRANSCRIPTION,
    fileRootAPK: process.env.FILE_ROOT_APK,
};
