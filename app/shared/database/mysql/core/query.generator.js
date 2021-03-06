class BaseFunction {
    queryAndValueGeneratorFunc(loopingObject, updateDisableColumns) {
        let query = " ";
        let value = [];
        try {
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
        }catch (e) {
            return false;
        }
    }
}

class QueryValue {
    constructor(query, value) {
        this.query = query;
        this.value = value;
    }
}

class QueryGenerator{

    getUpdateQueryByCriteria(updatingObject, entityName, condition, primaryId, updateDisableColumns) {
        const queryAndValueGenerator = new BaseFunction().queryAndValueGeneratorFunc(updatingObject, updateDisableColumns);
        const sqlQuery = "UPDATE " + entityName + " SET " + queryAndValueGenerator.query + " WHERE " + condition;
        const values = queryAndValueGenerator.values;
        return new QueryValue(sqlQuery, values);
    }

    getInsertQueryByCriteria(entityName, entityObject) {
        let queryValueObj = new QueryValue();
        queryValueObj.query = `INSERT INTO ${entityName} SET ?`;
        queryValueObj.value = entityObject;
        return queryValueObj;
    }

    getUpdateOneQuery(updateEntity, updateObject) {
        const condition = ` ${updateEntity['PrimaryKey']} = ${updateObject[updateEntity['PrimaryKey']]}`;
        return this.getUpdateQueryByCriteria(updateObject, updateEntity['EntityName'],
            condition, updateObject[updateEntity['PrimaryKey']], updateEntity['updateRestrictedColumns']);
    }

    getFindOneQuery(entity, primaryId) {
        return `SELECT * FROM  ${entity['EntityName']} WHERE ${entity['PrimaryKey']} ='${primaryId}'`;
    }

    getInsertOneQuery(insertEntity, insertObject) {
        return this.getInsertQueryByCriteria(insertEntity['EntityName'], insertObject)
    }
}

module.exports = new QueryGenerator();
