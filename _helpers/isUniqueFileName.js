const db = require("../models/");
const files = db.files;
module.exports = isUniqueFileName;

function isUniqueFileName(name) {
    return files.count({ where: { file_name: name } })
        .then(count => {
            if (count != 0) {
                return false;
            }
            return true;
        });
}