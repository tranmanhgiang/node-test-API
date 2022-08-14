import { nanoid } from 'nanoid';
import { Op, WhereOptions } from 'sequelize';
import bcrypt from '../lib/bcrypt';

import { UserAttributes, UserClientsSearchParam, UserModel, UserStatic } from '../interfaces/user';
import messages from '../commons/messages';
import constants, { USER_ROLE } from '../commons/constants';
import otp from '../lib/otp';
import mail from '../lib/mail';
import { FindAndCountSequelizeResponse, SearchParam } from '../commons/types';
import paginationHelper from '../helpers/paginationHelper';

export default class UserService {
    private user: UserStatic;
    constructor(user: UserStatic) {
        this.user = user;
    }

    /**
     * @param  {string} email
     * @returns Promise
     */
    protected async findUserByEmail(email: string): Promise<UserAttributes> {
        const query = {
            where: {
                email,
                deleted: false,
            },
        };
        const user = await this.user.findOne(query);
        return user;
    }

    /**
     * @param  {string} email
     * @returns Promise
     */
    protected async findUserById(id: number): Promise<UserAttributes> {
        const query = {
            where: {
                id,
                deleted: false,
            },
        };
        const user = await this.user.findOne(query);
        return user;
    }

    protected async findUserByRegisCode(registrationCode: string): Promise<UserAttributes> {
        const user = await this.user.findOne({
            where: {
                registrationCode,
                isActivated: true,
            },
        });
        return user;
    }

    protected async findUserByOtpSecret(otpSecret: string): Promise<UserAttributes> {
        const user = await this.user.findOne({
            where: {
                otpSecret,
            },
        });
        if (!user) return undefined;
        return user;
    }

    /**
     * @param  {string} email
     * @returns Promise
     */
    protected async updateUserByEmail(email: string, data: any): Promise<[number, UserModel[]]> {
        const user = await this.user.update(data, { where: { email } });
        return user;
    }

    /**
     * @param  {string} email
     * @param  {string} password
     * @returns Promise
     */
    protected async checkAuthenticationData(email: string, password: string): Promise<UserAttributes | undefined> {
        const user = await this.findUserByEmail(email.toLowerCase());
        if (!user || (password && !bcrypt.comparePassword(password, user.password))) {
            return undefined;
        }
        return user;
    }

    /**
     * @param  {string} email
     * @param  {string} password
     * @returns Promise
     */
    protected async checkAuthenticationDataChangePassword(email: string, password: string): Promise<UserAttributes & { valid: boolean }> {
        const user = await this.findUserByEmail(email);
        if (!user || (password && !bcrypt.comparePassword(password, user.password))) {
            return { ...user, valid: false };
        }
        return { ...user, valid: true };
    }

    protected async checkRegistrationCode(registrationCode: string): Promise<boolean> {
        const REGISTRATION_INVITE_CODES = process.env.REGISTRATION_INVITE_CODES.split(';');
        if (REGISTRATION_INVITE_CODES.includes(registrationCode)) {
            return true;
        }
        return false;
    }

    /**
     * @param  {string} email
     * @param  {string} password
     * @returns Promise
     */
    protected async createNewUser(userData: UserAttributes): Promise<UserAttributes | undefined | null> {
        const user = await this.findUserByEmail(userData.email);
        console.log('================================');
        console.log('user: ', user);
        console.log('================================');
        if (!user) {
            userData.otpSecret = nanoid();
            userData.password = bcrypt.generateHashPassword(userData.password);
            const createdUser = await this.user.create(userData);
            return createdUser;
        }
    }

    /**
     * @param  {string} email
     * @param  {string} password
     * @returns Promise
     */
    protected async createNewStaff(editorData: UserAttributes): Promise<UserAttributes | undefined | null> {
        const editor = await this.findUserByEmail(editorData.email);
        if (!editor) {
            editorData.otpSecret = nanoid();
            editorData.password = bcrypt.generateHashPassword(editorData.password);
            const createdUser = await this.user.create(editorData);
            return createdUser;
        }
        return undefined;
    }

    /**
     * send verification code via email
     * @param  {string} email
     * @param  {string} otpSecret
     * @returns void
     */
    protected sendEmailVerificationCode(email: string, otpSecret: string, userData: UserAttributes): void {
        const mailOptions = {
            to: email,
            subject: messages.mail.subject.verificationCode,
            template: constants.mailTemplate.verificationCode,
            data: {
                code: otp.generate(otpSecret),
                userName: userData.name || `${userData.firstName} ${userData.lastName}`,
            },
        };
        mail.requestSendMail(mailOptions);
    }

    /**
     * send verification code login via email
     * @param  {string} email
     * @param  {string} otpSecret
     * @returns void
     */
    protected sendEmailVerificationCodeLogin(email: string, otpSecret: string, userData: UserAttributes): void {
        const mailOptions = {
            to: email,
            subject: messages.mail.subject.verificationCode,
            template: constants.mailTemplate.verificationLogin,
            data: {
                code: otp.generate(otpSecret),
                userName: `${userData.firstName} ${userData.lastName}`,
            },
        };
        mail.requestSendMail(mailOptions);
    }

    /**
     * send invitation via email
     * @param  {string} email
     * @param  {string} otpSecret
     * @returns void
     */
    protected sendInvitationEmail(email: string, otpSecret: string, origin: string): void {
        const mailOptions = {
            to: email,
            subject: messages.mail.subject.inviteUser,
            template: constants.mailTemplate.inviteUser,
            data: {
                email,
                password: 'Password1!',
                link: `${origin}/editor/login?invitationCode=${otpSecret}`,
            },
        };
        mail.requestSendMail(mailOptions);
    }

    /**
     * get all User
     * @returns Promise
     */
    protected async getAllUser(params: UserClientsSearchParam): Promise<FindAndCountSequelizeResponse<UserAttributes>> {
        let whereCondition: WhereOptions = params?.searchValue?.trim()
            ? {
                  [Op.or]: [
                      { name: { [Op.iLike]: '%' + params.searchValue + '%' } },
                      { email: { [Op.iLike]: '%' + params.searchValue + '%' } },
                  ],
                  [Op.and]: { deleted: false, userRole: USER_ROLE.ADMIN },
              }
            : {
                  deleted: false,
                  userRole: USER_ROLE.ADMIN,
              };
        if (!params.sortBy) delete params.sortBy;
        if (!params.sortDirection) delete params.sortDirection;
        if (params.account) {
            whereCondition = { ...whereCondition, account: params.account };
        }
        const users = await this.user.findAndCountAll(paginationHelper.paginate(params, whereCondition));
        const result: FindAndCountSequelizeResponse<UserAttributes> = { ...users, page: params.page || 1 };
        return result;
    }

    /**
     * get all Staffs
     * @returns Promise
     */
    protected async getAllStaffs(params: SearchParam): Promise<FindAndCountSequelizeResponse<UserAttributes>> {
        const whereCondition: WhereOptions = params?.searchValue?.trim()
            ? {
                  [Op.or]: [
                      { firstName: { [Op.iLike]: '%' + params.searchValue + '%' } },
                      { lastName: { [Op.iLike]: '%' + params.searchValue + '%' } },
                      { email: { [Op.iLike]: '%' + params.searchValue + '%' } },
                  ],
                  [Op.and]: { deleted: false, userRole: [USER_ROLE.ADMIN] },
              }
            : {
                  deleted: false,
                  userRole: [USER_ROLE.ADMIN],
              };
        if (!params.sortBy) delete params.sortBy;
        if (!params.sortDirection) delete params.sortDirection;

        const users = await this.user.findAndCountAll(paginationHelper.paginate(params, whereCondition));
        const result: FindAndCountSequelizeResponse<UserAttributes> = { ...users, page: params.page || 1 };
        return result;
    }

    /**
     * get all User
     * @returns Promise
     */
    protected async getAccountsUser(): Promise<UserAttributes[]> {
        const whereCondition: WhereOptions = {
            deleted: false,
            userRole: USER_ROLE.USER,
        };
        const users = await this.user.findAll({ where: whereCondition });
        return users;
    }
}
