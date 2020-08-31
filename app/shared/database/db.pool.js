const mysql = require("mysql");
const appConfig = require("../../../app.config");

dbConfig = appConfig.DATABASE;

const pool = mysql.createPool({
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

module.exports = pool;
