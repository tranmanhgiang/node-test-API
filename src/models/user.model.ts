import { DataTypes, Sequelize } from 'sequelize';
import { USER_ROLE } from '../commons/constants';
import { UserStatic } from '../interfaces/user';
import sequelizeInstance from '../lib/sequelize';

const UserModel = function (sequelize: Sequelize): UserStatic {
    const User = <UserStatic>sequelize.define('Users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(70),
            unique: true,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        avatar: {
            type: DataTypes.STRING(200),
        },
        deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        userRole: {
            type: DataTypes.ENUM(USER_ROLE.USER, USER_ROLE.ADMIN),
            allowNull: false,
            defaultValue: USER_ROLE.USER,
        },
        otpSecret: {
            type: DataTypes.STRING(21),
            unique: true,
            allowNull: false,
        },
        isActivated: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    });

    User.prototype.toJSON = function () {
        const response = { ...this.get() };
        delete response.password;
        delete response.otpSecret;
        delete response.deleted;
        delete response.isActivated;
        delete response.registrationCode;
        return response;
    };

    return User;
};

export default UserModel(sequelizeInstance);
