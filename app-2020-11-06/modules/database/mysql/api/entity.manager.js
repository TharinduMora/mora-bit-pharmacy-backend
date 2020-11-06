const transaction = require("../operations/transaction.operation");
const poolOps = require("../operations/pool.operations");
const mySqlConfig = require("../config");
const logger = mySqlConfig.getLogger()('entity-manager.js');

class EntityManager {

    getTransaction() {
        return transaction.getTransaction();
    }

    async updateOne(entity, updatingObject) {
        return new Promise((resolve, reject) => {
            poolOps.updateOne(entity, updatingObject).then((result => {
                if (result.status === mySqlConfig.STATUS.SQL_ERROR) {
                    logger.error(result.data);
                    reject(result.data || null);
                } else if (result.status === mySqlConfig.STATUS.NOT_FOUND_ERR) {
                    resolve(null);
                } else if (result.status === mySqlConfig.STATUS.SUCCESS) {
                    resolve(result.data);
                } else {
                    resolve(null);
                }
            }))
        })
    }

    async findOne(entity, primaryId) {
        return new Promise((resolve, reject) => {
            poolOps.findOne(entity, primaryId).then((result => {
                if (result.status === mySqlConfig.STATUS.SQL_ERROR) {
                    logger.error(result.data);
                    reject(result.data || null);
                } else if (result.status === mySqlConfig.STATUS.NOT_FOUND_ERR) {
                    resolve(null);
                } else if (result.status === mySqlConfig.STATUS.SUCCESS) {
                    resolve(result.data);
                } else {
                    resolve(null);
                }
            }))
        })
    }

    async getResultByQuery(QUERY) {
        return new Promise((resolve, reject) => {
            poolOps.getResultByQuery(QUERY).then((result => {
                if (result.status === mySqlConfig.STATUS.SQL_ERROR) {
                    logger.error(result.data + '\t QUERY => ' + QUERY);
                    reject(result.data || null);
                } else if (result.status === mySqlConfig.STATUS.NOT_FOUND_ERR) {
                    resolve([]);
                } else if (result.status === mySqlConfig.STATUS.SUCCESS) {
                    resolve(result.data);
                } else {
                    resolve(null);
                }
            }))
        })
    }

    async insertOne(entity, entityObject) {
        return new Promise((resolve, reject) => {
            poolOps.insertOne(entity, entityObject).then((result => {
                if (result.status === mySqlConfig.STATUS.SQL_ERROR) {
                    logger.error(result.data);
                    reject(result.data || null);
                } else if (result.status === mySqlConfig.STATUS.SUCCESS) {
                    resolve(result.data);
                } else {
                    resolve(null);
                }
            }))
        })
    }
}

module.exports = new EntityManager();
