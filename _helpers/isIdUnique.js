const db = require("../models/");
const users = db.users;
module.exports = isIdUnique;

function isIdUnique(email) {
    return users.count({ where: { username: email } })
        .then(count => {
            if (count != 0) {
                return false;
            }
            return true;
        });
}