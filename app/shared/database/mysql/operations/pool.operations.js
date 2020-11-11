const ConnectionPool = require("../core/connection.pool");
const queryGenerator = require("../core/query.generator");
const poolConnection = ConnectionPool.getConnectionPool();
const mysqlConfig = require("../config");

exports.insertOne = function (entity, entityObject) {
    return new Promise((resolve, reject) => {
        const insertQueryObj = queryGenerator.getInsertOneQuery(entity, entityObject);
        poolConnection.query(insertQueryObj.query, insertQueryObj.value, (err, res) => {
            if (err) {
                resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.SQL_ERROR, data: err || null}));
                return;
            }
            entityObject[entity['PrimaryKey']] = res.insertId;
            resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.SUCCESS, data: entityObject}))
        });
    })
};

exports.updateOne = function (entity, updatingObject) {

    const queryValue = queryGenerator.getUpdateOneQuery(entity, updatingObject);

    return new Promise((resolve, reject) => {
        poolConnection.query(
            queryValue.query, queryValue.value, (err, res) => {
                if (err) {
                    resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.SQL_ERROR, data: err || null}));
                    return;
                }
                if (res.affectedRows === 0) {
                    resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.NOT_FOUND_ERR, data: null}));
                    return;
                }
                // resolve(DBResponseFactory.Success({id: updatingObject[entity['EntityName']]}));
                resolve(mysqlConfig.mysqlOutput({
                    status: mysqlConfig.STATUS.SUCCESS,
                    data: {id: updatingObject[entity['PrimaryKey']]}
                }));
            }
        );
    })
};

exports.findOne = function (entity, primaryId) {
    return new Promise((resolve, reject) => {
        const sqlQuery = queryGenerator.getFindOneQuery(entity, primaryId);
        poolConnection.query(sqlQuery, (err, res) => {
            if (err) {
                resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.SQL_ERROR, data: err || null}));
                return;
            }
            if (res.length) {
                // resolve(DBResponseFactory.Success(res[0]));
                resolve(mysqlConfig.mysqlOutput({
                    status: mysqlConfig.STATUS.SUCCESS,
                    data: res[0]
                }));
                return;
            }
            resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.NOT_FOUND_ERR, data: null}));
        });
    })
};

exports.getResultByQuery = function (SELECT_SQL) {
    return new Promise((resolve, reject) => {
        poolConnection.query(SELECT_SQL, (err, res) => {
            if (err) {
                resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.SQL_ERROR, data: err || null}));
                return;
            }
            if (res.length > 0) {
                // resolve(DBResponseFactory.Success(res));
                resolve(mysqlConfig.mysqlOutput({
                    status: mysqlConfig.STATUS.SUCCESS,
                    data: res
                }));
                return;
            }
            resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.NOT_FOUND_ERR, data: null}));
            // resolve(DBResponseFactory.DataNotFound())
        });
    });
};

// exports.updateEntityByCriteria = function (updatingObject, entityName, condition, primaryId, updateDisableColumns) {
//
//     const queryValue = queryGenerator.getUpdateQueryByCriteria(updatingObject, entityName, condition, primaryId, updateDisableColumns);
//
//     return new Promise((resolve, reject) => {
//         poolConnection.query(
//             queryValue.query, queryValue.value, (err, res) => {
//                 if (err) {
//                     resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.SQL_ERROR, data: err || null}));
//                     return;
//                 }
//                 if (res.affectedRows == 0) {
//                     resolve(mysqlConfig.mysqlOutput({status: mysqlConfig.STATUS.NOT_FOUND_ERR, data: null}));
//                     return;
//                 }
//                 resolve(DBResponseFactory.Success({id: primaryId}));
//             }
//         );
//     })
// };
// exports.getResultByQueryAsCallback = (SELECT_SQL, result) => {
//     poolConnection.query(SELECT_SQL, (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         }
//         if (res.length) {
//             result(null, {data: res});
//             return;
//         }
//         result({kind: "not_found"}, null);
//     });
// };


