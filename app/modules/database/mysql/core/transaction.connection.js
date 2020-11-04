const mysql = require("mysql");
const appConfig = require("../config");
const transaction = require('node-mysql-transaction');

dbConfig = appConfig.CONFIG;

const trCon = transaction({
    // mysql driver set
    connection: [mysql.createConnection, {
        host: dbConfig.HOST,
        user: dbConfig.USER,
        password: dbConfig.PASSWORD,
        database: dbConfig.DB
    }],
    dynamicConnection: 32,
    idleConnectionCutoffTime: 1000,
    timeout: 600
});

let transactionConnection = null

class TransactionConnection {

    constructor() {
        this.trCon = trCon;
    }

    static getTransactionConnection() {
        if (!transactionConnection) {
            transactionConnection = new TransactionConnection()
        }
        return transactionConnection.trCon;
    }
}

module.exports = TransactionConnection;
