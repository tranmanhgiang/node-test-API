import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { nanoid } from 'nanoid';
import _ from 'lodash';
import otp from '../lib/otp';
import messages from '../commons/messages';
import BadRequestError from '../commons/http-errors/BadRequestError';
import { generateToken } from '../lib/passports';
import UserRepository from '../repositories/user.repository';
import { responseError, responseSuccess } from '../helpers/response';
import bcrypt from '../lib/bcrypt';
import constants, { USER_ROLE, USER_STATUS } from '../commons/constants';
import paginationHelper from '../helpers/paginationHelper';
import env from '../../config/env';
import { getRootFilePath } from '../helpers/file';
import { UserClientsSearchParam } from '../interfaces/user';
import { SearchParam } from '../commons/types';

class UserController extends UserRepository {
    /**
     * User Login
     * @param  {Request} req
     * @param  {Response} res
     */
    public userLogin = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userData = await this.checkAuthenticationData(email, password);
        if (userData && userData.status === USER_STATUS.DEACTIVATED) {
            return responseError(res, httpStatus.UNAUTHORIZED, messages.auth.notActivated, {
                token: null,
                status: constants.loginStatus.inactiveAccount,
            });
        } else if (userData && userData.isActivated && userData.isActivated && userData.userRole === USER_ROLE.USER) {
            const token = generateToken(userData);
            return responseSuccess(res, { token, status: constants.loginStatus.success });
        } else if (
            userData &&
            userData.status === USER_STATUS.ACTIVATED &&
            (!userData.isActivated || userData.userRole !== USER_ROLE.USER)
        ) {
            return responseError(res, httpStatus.UNAUTHORIZED, messages.auth.invalidAction, {
                token: null,
                status: constants.loginStatus.invalidAccount,
            });
        } else {
            return responseError(res, httpStatus.UNAUTHORIZED, messages.auth.failed, {
                token: null,
                status: constants.loginStatus.invalidAccount,
            });
        }
    };

    /**
     * Editor Login
     * @param  {Request} req
     * @param  {Response} res
     */
    public editorLogin = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        const userData = await this.checkAuthenticationData(email, password);
        if (userData && userData.userRole !== USER_ROLE.USER) {
            // send verification code to user via email
            this.sendEmailVerificationCodeLogin(req.body.email, userData.otpSecret, userData);
            return responseSuccess(res, { email: userData.email });
        } else {
            return responseError(res, httpStatus.UNAUTHORIZED, messages.auth.failed, {
                token: null,
                status: constants.loginStatus.invalidAccount,
            });
        }
    };

    /**
     * Editor Verify Login
     * @param  {Request} req
     * @param  {Response} res
     */
    public editorVerifyLogin = async (req: Request, res: Response) => {
        const { email, code } = req.body;
        const editorData = await this.findUserByEmail(email);
        if (editorData) {
            if (otp.verify(code, editorData.otpSecret)) {
                if (editorData.isActivated) {
                    const token = generateToken(editorData);
                    return responseSuccess(res, { token, isActivated: editorData.isActivated });
                } else {
                    return responseSuccess(res, {
                        invitationCode: editorData.otpSecret,
                        isActivated: editorData.isActivated,
                        firstName: editorData.firstName,
                        lastName: editorData.lastName,
                    });
                }
            } else {
                throw new BadRequestError(messages.auth.invalidCode);
            }
        } else {
            throw new BadRequestError(messages.auth.userNotExists);
        }
    };

    /**
     * User verify regis code
     * @param  {Request} req
     * @param  {Response} res
     */
    public userVerifyRegisCode = async (req: Request, res: Response) => {
        const isValidCode = await this.checkRegistrationCode(req.body.registrationCode);
        return responseSuccess(res, { isValidCode });
    };

    /**
     * User SignUp
     * @param  {Request} req
     * @param  {Response} res
     */
    public userSignUp = async (req: Request, res: Response) => {
        const user = await this.createNewUser({ ...req.body, email: req.body.email.toLowerCase(), userRole: USER_ROLE.USER });
        if (user) {
            // send verification code to user via email
            // this.sendEmailVerificationCode(req.body.email, user.otpSecret, user);
            return responseSuccess(res, { user });
        } else if (user === null) {
            throw new BadRequestError(messages.auth.codeRegisExists);
        } else {
            throw new BadRequestError(messages.auth.userExists);
        }
    };

    /**
     * Admin SignUp
     * @param  {Request} req
     * @param  {Response} res
     */
    public adminSignUp = async (req: Request, res: Response) => {
        const admin = await this.createNewStaff({ ...req.body, email: req.body.email.toLowerCase(), userRole: USER_ROLE.ADMIN });
        if (admin) {
            // send verification code to admin via email
            this.sendEmailVerificationCode(req.body.email, admin.otpSecret, admin);
            return responseSuccess(res, { admin });
        } else {
            throw new BadRequestError(messages.auth.userExists);
        }
    };

    /**
     * Invite User
     * @param  {Request} req
     * @param  {Response} res
     */
    public inviteUser = async (req: Request, res: Response) => {
        const isAdmin = req.user.userRole === USER_ROLE.ADMIN;
        if (!isAdmin) return responseError(res, httpStatus.BAD_REQUEST, messages.auth.userNotExists);
        const user = await this.createNewStaff({
            ...req.body,
            password: 'Password1!',
            turnAroundTimeId: 1,
            email: req.body.email.toLowerCase(),
        });
        if (user) {
            // send verification code to user via email
            this.sendInvitationEmail(req.body.email, user.otpSecret, req.headers.origin as string);
            return responseSuccess(res, { user });
        } else if (user === null) {
            throw new BadRequestError(messages.auth.failed);
        } else {
            throw new BadRequestError(messages.auth.userExists);
        }
    };

    /**
     * Send verification code via email
     * @param  {Request} req
     * @param  {Response} res
     */
    public sendVerificationCode = async (req: Request, res: Response) => {
        const { email } = req.body;
        const userData = await this.findUserByEmail(email);
        if (userData) {
            const newSecretOtp = nanoid();
            await this.updateUserByEmail(email, { otpSecret: newSecretOtp });
            this.sendEmailVerificationCode(email, newSecretOtp, userData);
            return responseSuccess(res);
        } else {
            throw new BadRequestError(messages.auth.userNotExists);
        }
    };

    /**
     * Verify OPT Code  which sent through email to SignUp
     * @param  {Request} req
     * @param  {Response} res
     */
    public verifyCodeToActiveAccount = async (req: Request, res: Response) => {
        const { email, code } = req.body;
        const userData = await this.findUserByEmail(email);
        if (userData) {
            if (otp.verify(code, userData.otpSecret)) {
                await this.updateUserByEmail(email, { isActivated: true });
                const token = generateToken(userData);
                return responseSuccess(res, { token });
            } else {
                throw new BadRequestError(messages.auth.invalidCode);
            }
        } else {
            throw new BadRequestError(messages.auth.userNotExists);
        }
    };

    /**
     * Verify OPT Code  which sent through email to ResetPassword
     * @param  {Request} req
     * @param  {Response} res
     * @return OTP code to start changing password
     */
    public verifyCodeToResetPassword = async (req: Request, res: Response) => {
        const { email, code } = req.body;
        const userData = await this.findUserByEmail(email);
        if (userData) {
            if (otp.verify(code, userData.otpSecret)) {
                // return new OTP code to start changing password
                return responseSuccess(res, { code: otp.generate(userData.otpSecret) });
            } else {
                throw new BadRequestError(messages.auth.invalidCode);
            }
        } else {
            throw new BadRequestError(messages.auth.userNotExists);
        }
    };

    /**
     * User reset password
     * @param  {Request} req
     * @param  {Response} res
     */
    public userResetPassword = async (req: Request, res: Response) => {
        const { email, code, newPassword } = req.body;
        const userData = await this.findUserByEmail(email);
        if (userData) {
            if (otp.verify(code, userData.otpSecret)) {
                await this.updateUserByEmail(email, { password: bcrypt.generateHashPassword(newPassword), isActivated: true });
                return responseSuccess(res);
            } else {
                throw new BadRequestError(messages.auth.invalidCode);
            }
        } else {
            throw new BadRequestError(messages.auth.userNotExists);
        }
    };

    /**
     * User change password
     * @param  {Request} req
     * @param  {Response} res
     */
    public userChangePassword = async (req: Request, res: Response) => {
        const { newPassword, oldPassword } = req.body;
        const userData = await this.checkAuthenticationDataChangePassword(req.user.email, oldPassword);
        if (userData.valid) {
            await this.updateUserByEmail(req.user.email, { password: bcrypt.generateHashPassword(newPassword) });
            return responseSuccess(res);
        } else if (userData.userRole === USER_ROLE.USER) {
            throw new BadRequestError(messages.auth.passwordNotExists);
        } else {
            throw new BadRequestError(messages.auth.passcodeNotExists);
        }
    };

    /**
     * User check email
     * @param  {Request} req
     * @param  {Response} res
     */
    public checkEmail = async (req: Request, res: Response) => {
        const userData = await this.findUserByEmail(req.body.email);
        return responseSuccess(res, {
            isExisted: !!userData,
        });
    };

    /**
     * User check password
     * @param  {Request} req
     * @param  {Response} res
     */
    public checkPassword = async (req: Request, res: Response) => {
        const { password } = req.body;
        const userData = await this.checkAuthenticationData(req.user.email, password);
        if (userData) {
            return responseSuccess(res, {
                isCorrectPassword: true,
            });
        } else {
            return responseSuccess(res, {
                isCorrectPassword: false,
            });
        }
    };

    public getUsers = async (req: Request<undefined, undefined, undefined, UserClientsSearchParam>, res: Response) => {
        const { query } = req;
        const users = await this.getAllUser(query);
        const userAccounts = await this.getAccountsUser();
        const accounts = _.union(userAccounts.map((user) => user.account));
        return responseSuccess(res, { ...paginationHelper.formatResponse(users), accounts });
    };

    public getStaffs = async (req: Request<undefined, undefined, undefined, SearchParam>, res: Response) => {
        const { query } = req;
        const staffs = await this.getAllStaffs(query);
        return responseSuccess(res, { ...paginationHelper.formatResponse(staffs) });
    };

    /**
     * change avatar
     */
    public changeAvatar = async (req: Request, res: Response) => {
        const { fileName } = req.body;
        await this.updateUserByEmail(req.user.email, {
            avatar: fileName,
        });
        const user = await this.findUserByEmail(req.user.email);
        return responseSuccess(res, { user });
    };

    /**
     * get profile
     */
    public getProfile = async (req: Request, res: Response) => {
        const user = await this.findUserByEmail(req.user.email);
        return responseSuccess(res, { user });
    };

    /**
     * get avatar
     */
    public getAvatar = async (req: Request, res: Response) => {
        const { avatar } = req.params;
        res.sendFile(getRootFilePath(env.fileRootAvatar, avatar));
    };
}

export default UserController;
