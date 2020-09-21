const DBTransactionConnectionSingleton = require("./db.transaction.connection.singleton");
const transactionConnection = DBTransactionConnectionSingleton.getTransactionConnection();

// const chain = transactionConnection.chain();
//
// exports.setQuery = async (query, doCommit) => {
//     return new Promise((resolve, reject) => {
//         chain.query(query.query, query.value).on('result', function (result) {
//             resolve(result);
//             if (doCommit) {
//                 chain.commit();
//             }
//         }).autoCommit(false);
//     });
// };

class DbTransactionChain{
    constructor() {
        this.chain = transactionConnection.chain();
    }

    async setQueryAndGetResult(query){
        return new Promise((resolve, reject) => {
            this.chain.query(query.query, query.value).on('result', function (result) {
                resolve(result);
            }).autoCommit(false);
        });
    }

    async commitQueries(){
        return new Promise((resolve, reject) => {
            this.chain.on('commit', function (data) {
                resolve(null, data)
            }).on('rollback', function (err) {
                resolve(err.sqlMessage, null)
            });
            this.chain.commit();
        });
    }
}

module.exports = new DbTransactionChain();

