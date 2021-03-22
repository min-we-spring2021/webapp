if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const app = express();
const PORT = 8080;
const db = require("./models");
db.sequelize.sync();
const basicAuth = require('./_helpers/basic-auth');
const errorHandler = require('./_helpers/error-handler');
const isIdUnique = require('./_helpers/isIdUnique');
const validPW = require('./_helpers/validPW');
const isUniqueFileName = require('./_helpers/isUniqueFileName');
const fileUpload = require('express-fileupload');
const path = require('path');

const aws = require("aws-sdk");
// aws.config.update({
//     accessKeyId: process.env.accessKeyId,
//     secretAccessKey: process.env.secretAccessKey
// });
const s3 = new aws.S3();


const saltRounds = 10;
const users = db.users;
const books = db.books;
const files = db.files;
const Op = db.Sequelize.Op;



app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/v1/user/self', require('./users/users.controller'));
app.use(errorHandler);
app.use(fileUpload());


app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application." });
});
app.get("/v1/user/self", express.json(), (req, res) => {
});
app.put('/v1/user/self', express.json(), (req, res) => {
})
app.post('/v1/user', express.json(), async (req, res) => {
    const { first_name, last_name, password, email } = req.body;
    const uid = uuidv4();
    if (!validPW(password)) {
        res.status(401).json({ meg: "invalid password" })
        return;
    }
    const newUser = {};
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    newUser.id = uid,
        newUser.first_name = first_name,
        newUser.last_name = last_name,
        newUser.password = hashedPassword,
        newUser.username = email,
        newUser.account_created = new Date()

    isIdUnique(email).then(isUnique => {
        if (isUnique) {
            users.create(newUser)
                .then(data => {
                    res.status(200).json({ message: "you have create a new user." });
                })
                .catch(err => {
                    res.status(500).json({
                        message:
                            err.message || "Some error occurred while creating the user."
                    });
                });
        } else {
            res.status(500).json({ err: "same email exists" })
        }
    });
})
app.post("/books", express.json(), basicAuth, (req, res) => {
    const { title, author, isbn, published_date } = req.body;
    const user_id = req.user.id;
    const uid = uuidv4();
    const newBook = {
        id: uid,
        title: title,
        author: author,
        isbn: isbn,
        published_date: published_date,
        user_id: user_id,
        book_created: new Date()
    }
    books.create(newBook).then(data => {
        res.status(200).json(newBook)
    })
        .catch(err => {
            res.status(500).json({
                message:
                    err.message || "Some error occurred while creating the user."
            });
        });
});
app.delete('/books/:id', express.json(), basicAuth, (req, res) => {
    const id = req.params.id;
    books.destroy({
        where: { id: id }
    })
        .then(num => {
            if (num == 1) {
                res.status(200).send({
                    message: "The book was deleted successfully!"
                });
            } else {
                res.send({
                    message: `Cannot delete book with id=${id}. Maybe book was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete book with id=" + id
            });
        });
});
app.get("/mybooks", async (req, res) => {
    await books.findAll({
        include: [
            {
                model: db.files
            }
        ]
    })
        .then(books => {
            const resObj = books.map(book => {
                return Object.assign(
                    {},
                    {
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        isbn: book.isbn,
                        published_date: book.published_date,
                        book_created: book.book_created,
                        user_id: book.user_id,
                        files: book.files.map(file => {
                            return Object.assign(
                                {},
                                {
                                    file_id: file.file_id,
                                    file_name: file.name,
                                    s3_object_name: file.s3_object_name,
                                    create_date: file.create_date,
                                    user_id: file.user_id,
                                    book_id: file.book_id
                                }
                            )
                        })
                    }
                )
            })
            res.status(200).send(resObj);
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving books."
            });
        });
});
app.get("/books/:id", async (req, res) => {
    const id = req.params.id;
    await books.findAll({
        include: [
            {
                model: db.files
            }
        ]
    })
        .then(books => {
            const resObj = books.map(book => {
                return Object.assign(
                    {},
                    {
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        isbn: book.isbn,
                        published_date: book.published_date,
                        book_created: book.book_created,
                        user_id: book.user_id,
                        files: book.files.map(file => {
                            return Object.assign(
                                {},
                                {
                                    file_id: file.file_id,
                                    file_name: file.name,
                                    s3_object_name: file.s3_object_name,
                                    create_date: file.create_date,
                                    user_id: file.user_id,
                                    book_id: file.book_id
                                }
                            )
                        })
                    }
                )
            })
            res.status(200).send(resObj.find(book => book.id == id));
        })
        .catch(err => {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving books."
            });
        });
});
app.delete('/books/:book_id/image/:image_id', express.json(), basicAuth, (req, res) => {
    const image_id = req.params.image_id;
    const params = {
        Bucket: process.env.Bucket || "webapp-wenhao-min",
        Key: image_id,
    };
    files.destroy({
        where: { file_id: image_id }
    })
        .then(num => {
            if (num == 1) {
                s3.deleteObject(params, function (err, data) {
                    if (err) {
                        res.status(400).send("you have delete mateData in mysql,but has some err while delete in S3" + err);
                        throw err;
                    }
                    res.status(200).send({ message: "The file was deleted successfully!" })
                })
            } else {
                res.send({
                    message: `Cannot delete file with id=${image_id}. Maybe file was not found!`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete book with id=" + id
            });
        });
});
app.post('/books/:book_id/image', express.json(), basicAuth, (req, res) => {
    const bookId = req.params.book_id;
    const user_id = req.user.id;
    const imageId = uuidv4();
    const length = Object.keys(req.files).length;
    if (length != 1) {
        res.status(401).send({ message: "you should upload a file each time" });
        return;
    }
    const fileContent = Buffer.from(req.files.image.data, 'binary');
    const file = {
        "file_name": req.files.image.name,
        "s3_object_name": bookId + '/' + imageId + '/' + '/' + req.files.image.name,
        "file_id": imageId,
        "user_id": user_id,
        "book_id": bookId,
        'create_date': new Date(Date.now()).toISOString(),
        "bookId": bookId
    }
    const params = {
        Bucket: process.env.Bucket || "webapp-wenhao-min",
        Key: imageId,
        Body: fileContent
    };
    isUniqueFileName(file.file_name).then(isUnique => {
        if (isUnique) {
            files.create(file)
                .then(data => {
                    s3.upload(params, function (err, data) {
                        if (err) {
                            res.status(400).send("you have save mateData in mysql,but has some err while upload to S3" + err);
                            throw err;
                        }
                        res.status(200).json(file)
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        message:
                            err.message || "Some error occurred while update file to mysql."
                    });
                });
        } else {
            res.status(500).json({ err: "same file name exists" })
        }
    });
});

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));