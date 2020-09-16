const mainConfig = require("../../config/main.config");
const ResponseFactory = require("../dynamic.response.factory");
const ConnectionPool = require("./db.connection.pool.singleton");
const queryGenFunctions = require("./db.query.gen.function");
const poolConnection = ConnectionPool.getConnectionPool();

const DBTransactionConnectionSingleton = require("./db.transaction.connection.singleton");
const transactionConnection = DBTransactionConnectionSingleton.getTransactionConnection();

exports.create = function (entityName, entityObject) {
    return new Promise((resolve, reject)=>{
        poolConnection.query(`INSERT INTO ${entityName} SET ?`, entityObject, (err, res) => {
            if (err) {
                console.log(entityName + " creation failed with error: ", err);
                resolve(ResponseFactory.getErrorResponse({message:err}))
                return;
            }
            console.log("created : " + entityName + " ID: " + res.insertId);
            entityObject.id = res.insertId;
            resolve(ResponseFactory.getSuccessResponse({data:entityObject}))
        });
    })
};

exports.updateEntity = function (updatingObject, entityName, condition, primaryId, updateDisableColumns) {

    const queryValue = queryGenFunctions.getUpdateQuery(0,updatingObject, entityName, condition, primaryId, updateDisableColumns);

    return new Promise((resolve, reject)=>{
        poolConnection.query(
            queryValue.query, queryValue.value, (err, res) => {
                if (err) {
                    console.log("updating " + entityName + " failed with error: ", err);
                    resolve(ResponseFactory.getErrorResponse({message:err}))
                    return;
                }
                if (res.affectedRows == 0) {
                    resolve(ResponseFactory.getSuccessResponse({id:mainConfig.DB_RESPONSE_IDS.DATA_NOT_FOUND}));
                    return;
                }
                console.log("updated " + entityName + " Id: ", primaryId);
                resolve(ResponseFactory.getSuccessResponse({id:primaryId}))
            }
        );
    })
};

exports.findOne = function(entityName, primaryKey, primaryId) {
    return new Promise((resolve, reject)=>{
        const sqlQuery = `SELECT * FROM  ${entityName} WHERE ${primaryKey} = '${primaryId}'`;
        poolConnection.query(sqlQuery, (err, res) => {
            if (err) {
                console.log("error: ", err);
                resolve(ResponseFactory.getErrorResponse({message:err}))
                return;
            }
            if (res.length) {
                resolve(ResponseFactory.getSuccessResponse({data:res[0]}));
                return;
            }
            resolve(ResponseFactory.getSuccessResponse({id:mainConfig.DB_RESPONSE_IDS.DATA_NOT_FOUND}));
        });
    })
};

exports.getResultByQuery = function(SELECT_SQL){
    return new Promise((resolve, reject) => {
        poolConnection.query(SELECT_SQL, (err, res) => {
            if (err) {
                console.log(err.sqlMessage);
                resolve(ResponseFactory.getErrorResponse({message:err}))
                return;
            }
            if (res.length>0) {
                resolve(ResponseFactory.getSuccessResponse({data:res}));
                return;
            }
            resolve(ResponseFactory.getSuccessResponse({id:mainConfig.DB_RESPONSE_IDS.DATA_NOT_FOUND}));
        });
    });
}

exports.runAsTransaction = (queryListArray, resultMapKey, result) => {
    const chain = transactionConnection.chain();
    chain.on('commit', function (data) {
        result(null, resultMap)
    }).on('rollback', function (err) {
        result(err.sqlMessage, null)
    });

    const resultMap = {};

    queryListArray.forEach((query) => {
        if (query instanceof QueryValue) {
            chain.query(query.query, query.value).on('result', function (res) {
                if (res.affectedRows > 0 && res.insertId > 0) {
                    resultMap[resultMapKey + query.queryId] = {insertId: res.insertId};
                }
            });
        }
    });
};
