module.exports = {
    up: async (queryInterface, Sequelize) => {
        /**
         * Add altering commands here.
         *
         * Example:
         * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.INTEGER,
                autoIncrement: true,
            },
            firstName: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING(50),
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING(50),
                unique: true,
                allowNull: false,
            },
            password: {
                type: Sequelize.STRING(200),
                allowNull: false,
            },
            avatar: {
                type: Sequelize.STRING(200),
            },
            deleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            userRole: {
                type: Sequelize.ENUM('User', 'Admin'),
                allowNull: false,
                defaultValue: 'User',
            },
            registrationCode: {
                type: Sequelize.STRING(8),
                allowNull: false,
            },
            otpSecret: {
                type: Sequelize.STRING(21),
                unique: true,
                allowNull: false,
            },
            isActivated: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },

    down: async (queryInterface) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('Users');
    },
};
