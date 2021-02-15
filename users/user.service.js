//const users = [{ id: 1, username: 'test', password: 'test', firstName: 'Test', lastName: 'User' }];
const db = require("../models");
const users = db.users;
const bcrypt = require('bcrypt');
const saltRounds = 10;
module.exports = {
    authenticate,
    update
};
function validPW(pw) {
    const reg = /[a-z]+[0-9]+/;
    const reg2 = /[0-9]+[a-z]+/;
    return pw.length > 8 && (reg.test(pw) || reg2.test(pw));
}

async function authenticate({ username, password }) {
    const user = await users.findOne({ where: { username: username } });

    const result = bcrypt.compareSync(password, user.dataValues.password);
    //, function (err, result) {
    if (result) {
        const { password, ...userWithoutPassword } = user.dataValues;
        return userWithoutPassword;
    }
    else {
        console.log("Invalid password!");
    }
}
async function update({ first_name, last_name, password }, { username }, res) {
    if (!validPW(password)) {
        res.status(401).json({ meg: "invalid password" })
        return;
    }
    const newUser = {
        first_name: first_name,
        last_name: last_name,
        password: bcrypt.hashSync(password, saltRounds),
        account_updated: Date.now()
    };

    //    bcrypt.hash(password, saltRounds, function (err, hash) {
    //         newUser.first_name = first_name,
    //             newUser.last_name = last_name,
    //             newUser.password = hash
    //         newUser.account_updated = Date.now()
    //     });

    users.update(newUser, {
        where: { username: username }
    })
        .then(num => {
            if (num == 1) {

                res.status(200).json({
                    message: "user was updated successfully."
                });
            } else {
                res.status(500).json({
                    message: `Cannot update this user, Maybe user was not found or update message is empty!`
                });
            }
        })
        .catch(err => {
            res.status(500).json({
                message: "Error updating the user"
            });
        });


}

