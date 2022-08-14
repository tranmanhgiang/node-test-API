import nodemailer from 'nodemailer';
import path from 'path';
import EmailTemplate from 'email-templates';
import InternalServerError from '../commons/http-errors/InternalServerError';
import config from '../../config/env';
import messages from '../commons/messages';
import { logger } from '../helpers/logger';

interface IMailServer {
    mailServer: string;
    mailPort: string;
    mailAuthUserName: string;
    mailAuthPassword: string;
    senderEmail: string;
    senderName: string;
}

interface IMail {
    from?: string;
    to: string;
    subject: string;
    template: string;
    data: any;
}

interface IMailTemplate {
    from: string;
    to: string;
    subject: string;
    html: string;
    text?: string;
}

const emailTemplateDir = path.resolve('src/resources/templates/emails');

class Mail {
    private smtpTransport: any;
    private mailServerInfo: IMailServer;

    constructor(mailInfo: IMailServer) {
        this.mailServerInfo = mailInfo;
        this.initializeMailService(mailInfo);
    }

    private initializeMailService(mailInfo: IMailServer) {
        const smtpTransport = nodemailer.createTransport({
            host: mailInfo.mailServer,
            port: mailInfo.mailPort,
            secure: false,
            auth: {
                user: mailInfo.mailAuthUserName,
                pass: mailInfo.mailAuthPassword,
            },
            // secure: true,
        });
        this.smtpTransport = smtpTransport;
    }

    public async requestSendMail(mail: IMail): Promise<string> {
        if (!mail.from) {
            mail.from = `${this.mailServerInfo.senderName} <${this.mailServerInfo.senderEmail}>`;
        }
        const template = new EmailTemplate();
        const results = await template.render(path.join(emailTemplateDir, mail.template, 'index.pug'), mail.data);
        const sendStatus = await this.send({
            from: mail.from,
            to: mail.to,
            subject: mail.subject,
            html: results,
        });
        return sendStatus;
    }

    private send(mail: IMailTemplate): Promise<string> {
        return new Promise((resolve, reject) => {
            this.smtpTransport.sendMail(mail, function (error: Error, info) {
                if (error) {
                    logger.error(error);
                    return reject(new InternalServerError(messages.mail.sendError));
                }
                resolve('Message sent: ' + info.response);
            });
        });
    }
}

export default new Mail({
    mailServer: config.mailServer,
    mailPort: config.mailPort,
    mailAuthUserName: config.mailAuthUserName,
    mailAuthPassword: config.mailAuthPassword,
    senderEmail: config.senderEmail,
    senderName: config.senderName,
});
