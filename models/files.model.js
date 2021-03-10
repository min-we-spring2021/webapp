module.exports = (sequelize, Sequelize) => {
    const Files = sequelize.define("files", {
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
            type: Sequelize.DATE,
            allowNull: false,
            noUpdate: true

        },

        user_id: {
            type: Sequelize.STRING,
            noUpdate: true
        },
        book_id: {
            type: Sequelize.STRING,
            noUpdate: true
        }

    }, { //underscored: true
    });

    return Files;
};