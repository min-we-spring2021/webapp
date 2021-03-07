
module.exports = {
    HOST: process.env.HOST || "localhost",
    USER: process.env.USERNAME || "root",
    PASSWORD: process.env.PASSWORD || "123456",
    DB: "csye6225",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
};