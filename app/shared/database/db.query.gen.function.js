// exports.getUpdateQuery = (queryId, updatingObject, entityName, condition, primaryId, updateDisableColumns) => {
//     const queryAndValueGenerator = queryAndValueGeneratorFunc(updatingObject, updateDisableColumns);
//     const sqlQuery = "UPDATE " + entityName + " SET " + queryAndValueGenerator.query + " WHERE " + condition;
//     const values = queryAndValueGenerator.values;
//     return new QueryValue(queryId, sqlQuery, values);
// }
//
// exports.getInsertQuery = (queryId, entityName, entityObject) => {
//     let queryValueObj = new QueryValue();
//     queryValueObj.queryId = queryId;
//     queryValueObj.query = `INSERT INTO ${entityName} SET ?`;
//     queryValueObj.value = entityObject;
//     return queryValueObj;
// }
//
// function queryAndValueGeneratorFunc(loopingObject, updateDisableColumns) {
//     let query = " ";
//     let value = [];
//     Object.keys(loopingObject).forEach(function (key) {
//         if (loopingObject[key] !== undefined && !updateDisableColumns.includes(key)) {
//             query = query + key + " = ? , ";
//             value.push(loopingObject[key])
//         }
//     });
//     query = query.slice(0, query.lastIndexOf(","));
//
//     return {
//         query: query,
//         values: value
//     };
// }

class QueryValue {
    constructor(queryId, query, value) {
        this.queryId = queryId;
        this.query = query;
        this.value = value;
    }
}

class QueryGenFunctions {

    getUpdateQuery(queryId, updatingObject, entityName, condition, primaryId, updateDisableColumns) {
        const queryAndValueGenerator = this.queryAndValueGeneratorFunc(updatingObject, updateDisableColumns);
        const sqlQuery = "UPDATE " + entityName + " SET " + queryAndValueGenerator.query + " WHERE " + condition;
        const values = queryAndValueGenerator.values;
        return new QueryValue(queryId, sqlQuery, values);
    }

    getInsertQuery(queryId, entityName, entityObject) {
        let queryValueObj = new QueryValue();
        queryValueObj.queryId = queryId;
        queryValueObj.query = `INSERT INTO ${entityName} SET ?`;
        queryValueObj.value = entityObject;
        return queryValueObj;
    }

    queryAndValueGeneratorFunc(loopingObject, updateDisableColumns) {
        let query = " ";
        let value = [];
        Object.keys(loopingObject).forEach(function (key) {
            if (loopingObject[key] !== undefined && !updateDisableColumns.includes(key)) {
                query = query + key + " = ? , ";
                value.push(loopingObject[key])
            }
        });
        query = query.slice(0, query.lastIndexOf(","));

        return {
            query: query,
            values: value
        };
    }
}

module.exports = new QueryGenFunctions();