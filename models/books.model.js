const file = require("./file.model")
module.exports = (sequelize, Sequelize) => {
    const Books = sequelize.define("books", {
        id: {
            type: Sequelize.STRING,
            noUpdate: true,
            primaryKey: true,
            allowNull: false

        },
        title: {
            type: Sequelize.STRING,
            allowNull: false
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false
        },
        isbn: {
            type: Sequelize.STRING,
            allowNull: false
        },
        published_date: {
            type: Sequelize.DATEONLY,
            allowNull: false

        },
        book_created: {
            type: Sequelize.DATE,
            noUpdate: true
        },
        user_id: {
            type: Sequelize.STRING,
            noUpdate: true
        },
        book_images: [file]

    });

    return Books;
};