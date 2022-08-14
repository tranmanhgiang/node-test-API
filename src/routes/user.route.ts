import express from 'express';
import { validate } from 'express-validation';
import multer from 'multer';
import path from 'path';
import UserController from '../controllers/user.controller';
import authentication from '../middlewares/authentication';
import UserRequest from '../request/user.request';

import userModel from '../models/user.model';
import wrap from '../helpers/wrap';
import env from '../../config/env';
import BadRequestError from '../commons/http-errors/BadRequestError';
import messages from '../commons/messages';
import fileUploadMiddleware from '../middlewares/fileUpload';

const router = express.Router();
const userController = new UserController(userModel);

router.post('/sign-up', validate(UserRequest.userSignUp), wrap(userController.userSignUp));
router.post('/admin/sign-up', validate(UserRequest.adminSignUp), wrap(userController.adminSignUp));
router.post('/verify-regis-code', validate(UserRequest.verifyCodeRegistration), wrap(userController.userVerifyRegisCode));
router.post('/verify-sign-up-code', validate(UserRequest.verifyCodeToSignUp), wrap(userController.verifyCodeToActiveAccount));
router.post('/login', validate(UserRequest.userLogin), wrap(userController.userLogin));
router.post('/editor/login', validate(UserRequest.editorLogin), wrap(userController.editorLogin));
router.post('/editor/verify-login', validate(UserRequest.verifyCodeEditorLogin), wrap(userController.editorVerifyLogin));
router.post('/send-verify-code', validate(UserRequest.sendVerifyCode), wrap(userController.sendVerificationCode));
router.post('/verify-reset-password-code', validate(UserRequest.verifyCodeToResetPassword), wrap(userController.verifyCodeToResetPassword));
router.post('/editor/reset-password', validate(UserRequest.editorResetPassword), wrap(userController.userResetPassword));
router.post('/reset-password', validate(UserRequest.userResetPassword), wrap(userController.userResetPassword));
router.post('/change-password', [authentication], wrap(userController.userChangePassword));
router.post('/check-password', [authentication], wrap(userController.checkPassword));
router.get('/client-user', [authentication], wrap(userController.getUsers));
router.get('/staffs', [authentication], wrap(userController.getStaffs));
router.post('/invite-user', [authentication, validate(UserRequest.inviteUser)], wrap(userController.inviteUser));

router.post(
    '/change-avatar',
    [
        authentication,
        multer({
            storage: fileUploadMiddleware.storage(env.fileRootAvatar),
            fileFilter: (_req, file, callback) => {
                if (!['.jpg', '.jpeg', '.png'].includes(path.extname(file.originalname).toLocaleLowerCase())) {
                    return callback(new BadRequestError(messages.upload.fileAvatarExtensionNotAllow));
                }
                callback(null, true);
            },
            limits: { fileSize: 10485760 /** Max size file upload is 10MB */ },
        }).single('file'),
    ],
    wrap(userController.changeAvatar)
);
router.get('/avatar/:avatar', wrap(userController.getAvatar));
router.get('/profile', [authentication], wrap(userController.getProfile));

export default router;
