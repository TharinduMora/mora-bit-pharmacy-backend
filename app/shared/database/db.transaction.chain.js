const DBTransactionConnectionSingleton = require("./db.transaction.connection.singleton");
const transactionConnection = DBTransactionConnectionSingleton.getTransactionConnection();

const dbResponses = require("../../APIs/response/db.response.factory");

class TransactionChain{
    constructor() {
        this.chain = transactionConnection.chain();
    }

    async setQueryAndGetResult(query){
        return new Promise((resolve, reject) => {
            this.chain.query(query.query, query.value).on('result', (result)=> {
                resolve(dbResponses.Success(result));
            }).on('error', (err)=>{
                resolve(dbResponses.SQL_ERROR(err));
                this.chain.rollback(err);
            }).autoCommit(false);
        });
    }

    async commitQueries(){
        return new Promise((resolve, reject) => {
            this.chain.on('commit', (data) =>{
                console.log('commit')
                resolve(dbResponses.CommitSuccess(data));
            }).on('rollback', (err) =>{
                console.log('rollback')
                resolve(dbResponses.Rollback(err))
            });
            this.chain.commit();
        });
    }

    rollback(){
        this.chain.rollback();
    }
}

class DBTransactionChain{
    getTransactionChain(){
        return new TransactionChain();
    }

}

module.exports = new DBTransactionChain();

