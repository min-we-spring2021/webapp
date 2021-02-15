module.exports = (sequelize, Sequelize) => {
    const Users = sequelize.define("users", {
        id: {
            type: Sequelize.STRING,
            noUpdate: true,
            primaryKey: true,
            allowNull: false

        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        last_name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
            // validate: {
            //     len: [9, 20],
            //     is: /^[a-z]+[0-9]+$/i
            // }
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: { isEmail: true }
        },
        account_created: {
            type: Sequelize.DATE,
            noUpdate: true
        },
        account_updated: {
            type: Sequelize.DATE

        }

    });

    return Users;
};


