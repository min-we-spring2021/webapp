const express = require('express');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const cors = require("cors");
const app = express();
const PORT = 5000;
const db = require("./models");
const basicAuth = require('./_helpers/basic-auth');
const errorHandler = require('./_helpers/error-handler');


const saltRounds = 10;

function isIdUnique(email) {
    return users.count({ where: { username: email } })
        .then(count => {
            if (count != 0) {
                return false;
            }
            return true;
        });
}
function validPW(pw) {
    const reg = /[a-z]+[0-9]+/;
    const reg2 = /[0-9]+[a-z]+/;
    return pw.length > 8 && (reg.test(pw) || reg2.test(pw));
}


app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(basicAuth);
//api routes
app.use('/v1/user/self', require('./users/users.controller'));
//global error handler
app.use(errorHandler);




const users = db.users;
const Op = db.Sequelize.Op;

app.get("/", (req, res) => {
    res.json({ message: "Welcome to my application." });
});

app.get("/v1/user/self", express.json(), (req, res) => {


});



app.put('/v1/user/self', express.json(), (req, res) => {

})

app.post('/v1/user', express.json(), (req, res) => {

    const { first_name, last_name, password, email } = req.body;
    const uid = uuidv4();
    if (!validPW(password)) {
        res.status(401).json({ meg: "invalid password" })
        return;
    }
    const newUser = {};
    bcrypt.hash(password, saltRounds, function (err, hash) {
        newUser.id = uid,
            newUser.first_name = first_name,
            newUser.last_name = last_name,
            newUser.password = hash,
            newUser.username = email,
            newUser.account_created = Date.now()
    });
    //console.log(req.headers.authorization)
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

app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));