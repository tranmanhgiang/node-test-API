import { BuildOptions, Model } from 'sequelize';
import { SearchParam } from '../commons/types';
export interface UserAttributes {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    deleted: boolean;
    registrationCode?: string;
    avatar: string | null;
    userRole: 'User' | 'Admin';
    otpSecret: string;
    isActivated: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    employeeEmail: string;
    account?: string;
    turnAroundTimeId: number;
    status: 'Activated' | 'Deactivated';
    name: string;
}

export interface UserModel extends Model<UserAttributes>, UserAttributes {}
export class User extends Model<UserModel, UserAttributes> {}
export type UserStatic = typeof Model & {
    new (values?: object, options?: BuildOptions): UserModel;
};
export interface UserClientsSearchParam extends SearchParam {
    account?: string;
}

export type UserStatus = 'Activated' | 'Deactivated';

export type UserRole = 'Admin' | 'User';
