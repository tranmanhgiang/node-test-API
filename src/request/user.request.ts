import { Joi } from 'express-validation';
import messages from '../commons/messages';
import { PASSWORD_RULE_REGEX, USER_ROLE_INVITATION } from '../commons/constants';

export default {
    userLogin: {
        body: Joi.object({
            email: Joi.string().email().lowercase().required(),
            password: Joi.string().required(),
        }),
    },
    editorLogin: {
        body: Joi.object({
            email: Joi.string().email().lowercase().required(),
            password: Joi.string().max(32).regex(PASSWORD_RULE_REGEX).message(messages.auth.passwordRules).required(),
        }),
    },
    verifyCodeRegistration: {
        body: Joi.object({
            registrationCode: Joi.string().length(8).required(),
        }),
    },
    userSignUp: {
        body: Joi.object({
            firstName: Joi.string().max(50).allow(''),
            lastName: Joi.string().max(50).allow(''),
            account: Joi.string().max(50).allow(''),
            email: Joi.string().email().max(70).lowercase().required(),
            password: Joi.string().max(32).required(),
            // registrationCode: Joi.string().length(8).required(),
            turnAroundTimeId: Joi.number().required(),
            name: Joi.string().max(100).required(),
        }),
    },
    adminSignUp: {
        body: Joi.object({
            firstName: Joi.string().max(50).required(),
            lastName: Joi.string().max(50).required(),
            email: Joi.string().email().max(70).lowercase().required(),
            password: Joi.string().max(32).regex(PASSWORD_RULE_REGEX).message(messages.auth.passwordRules).required(),
            turnAroundTimeId: Joi.number().required(),
            name: Joi.string().max(100).allow(''),
        }),
    },
    verifyCodeToSignUp: {
        body: Joi.object({
            email: Joi.string().email().required(),
            code: Joi.string().length(6).required(),
        }),
    },
    sendVerifyCode: {
        body: Joi.object({
            email: Joi.string().email().required(),
        }),
    },
    verifyCodeToResetPassword: {
        body: Joi.object({
            email: Joi.string().email().required(),
            code: Joi.string().length(6).required(),
        }),
    },
    verifyCodeEditorLogin: {
        body: Joi.object({
            email: Joi.string().email().required(),
            code: Joi.string().length(6).required(),
        }),
    },
    editorResetPassword: {
        body: Joi.object({
            email: Joi.string().email().required(),
            newPassword: Joi.string().max(32).regex(PASSWORD_RULE_REGEX).message(messages.auth.passwordRules).required(),
            confirmationPassword: Joi.ref('newPassword'),
            code: Joi.string().max(16).required(),
        }),
    },
    userResetPassword: {
        body: Joi.object({
            email: Joi.string().email().required(),
            newPassword: Joi.string().max(200).required(),
            confirmationPassword: Joi.ref('newPassword'),
            code: Joi.string().max(16).required(),
        }),
    },
    checkEmail: {
        body: Joi.object({
            email: Joi.string().email().required(),
        }),
    },
    inviteUser: {
        body: Joi.object({
            userRole: Joi.string()
                .valid(...USER_ROLE_INVITATION)
                .required(),
            lastName: Joi.string().required(),
            firstName: Joi.string().required(),
            email: Joi.string().email().required(),
        }),
    },
    staffFirstChangePassword: {
        body: Joi.object({
            newPassword: Joi.string().max(32).regex(PASSWORD_RULE_REGEX).message(messages.auth.passwordRules).required(),
            oldPassword: Joi.string().required(),
            invitationCode: Joi.string().required(),
        }),
    },
};
