const mysql = require("mysql");
const appConfig = require("../config");

dbConfig = appConfig.CONFIG;

const createdPool = mysql.createPool({
    connectionLimit: dbConfig.CONNECTION_LIMIT,
    host: dbConfig.HOST,
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    database: dbConfig.DB
});

let connectionPool = null

class ConnectionPoolClass {

    constructor() {
        this.createdPool = createdPool;
    }

    static getConnectionPool() {
        if (!connectionPool) {
            connectionPool = new ConnectionPoolClass()
        }
        return connectionPool.createdPool;
    }
}

module.exports = ConnectionPoolClass;
