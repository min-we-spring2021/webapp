module.exports = (sequelize, Sequelize) => {
    const Books = sequelize.define("file", {
        file_id: {
            type: Sequelize.STRING,
            noUpdate: true,
            primaryKey: true,
            allowNull: false

        },
        file_name: {
            type: Sequelize.STRING,
            allowNull: false,
            noUpdate: true
        },
        s3_object_name: {
            type: Sequelize.STRING,
            allowNull: false,
            noUpdate: true
        },

        create_date: {
            type: Sequelize.DATEONLY,
            allowNull: false,
            noUpdate: true

        },

        user_id: {
            type: Sequelize.STRING,
            noUpdate: true
        }

    });

    return file;
};