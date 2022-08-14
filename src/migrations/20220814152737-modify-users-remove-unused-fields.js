module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Users', 'registrationCode', Sequelize.BOOLEAN);
    },

    down: async (queryInterface, Sequelize) => {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
        await queryInterface.dropTable('Users');
    },
};
