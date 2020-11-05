const transactionConnection = require("../core/transaction.connection").getTransactionConnection();
const queryGenerator = require("../core/query.generator");
const mysqlConfig = require("../config");
const logger = mysqlConfig.getLogger()('transaction.operation.js');

class TransactionChain {
    constructor() {
        this.chain = transactionConnection.chain();
    }

    async execute(query) {
        return new Promise((resolve, reject) => {
            this.chain.query(query.query, query.value).on('result', (result) => {
                resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.SUCCESS, data: result}));
            }).on('error', (err) => {
                resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.SQL_ERROR, data: err || null}));
                this.chain.rollback(err);
            }).autoCommit(false);
        });
    }

    async persist(persistEntity, persistObject) {
        const InsertQueryObject = queryGenerator.getInsertOneQuery(persistEntity, persistObject);
        return new Promise((resolve, reject) => {
            this.chain.query(InsertQueryObject.query, InsertQueryObject.value).on('result', (result) => {
                persistObject[persistEntity['PrimaryKey']] = result.insertId;
                resolve(persistObject);
            }).on('error', (err) => {
                logger.error('[persist -> ' + persistEntity['EntityName'] + '] ' + (err || 'transaction persist error'));
                reject(err || null);
                this.chain.rollback(err);
            }).autoCommit(false);
        });
    }

    async merge(mergeEntity, mergeObject) {
        const UpdateQueryObject = queryGenerator.getUpdateOneQuery(mergeEntity, mergeObject);
        return new Promise((resolve, reject) => {
            this.chain.query(UpdateQueryObject.query, UpdateQueryObject.value).on('result', (result) => {
                resolve(mergeObject);
            }).on('error', (err) => {
                logger.error('[merge -> ' + mergeEntity['EntityName'] + '] ' + (err || 'transaction merge error'));
                reject(err || null);
                this.chain.rollback(err);
            }).autoCommit(false);
        });
    }

    async commit() {
        return new Promise((resolve, reject) => {
            this.chain.on('commit', (data) => {
                resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.SUCCESS, data: data}));
            }).on('rollback', (err) => {
                logger.error('[commit] ' + (err || 'transaction commit error! rollback to previous state.'));
                reject(err || null);
            });
            this.chain.commit();
        });
    }

    rollback() {
        this.chain.rollback();
    }
}

class DBTransactionChain {
    getTransaction() {
        return new TransactionChain();
    }

}

module.exports = new DBTransactionChain();

