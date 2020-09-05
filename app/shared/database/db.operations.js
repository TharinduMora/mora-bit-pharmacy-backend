const poolConnection = require("./db.pool");

function queryAndValueGeneratorFunc(loopingObject, updateDisableColumns) {
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

exports.create = (entityName, entityObject, result) => {
    poolConnection.query(`INSERT INTO ${entityName} SET ?`, entityObject, (err, res) => {
        if (err) {
            console.log(entityName + " creation failed with error: ", err);
            result(err, null);
            return;
        }

        console.log("created : " + entityName + " ID: "+res.insertId);
        result(null, {id: res.insertId, ...entityObject});
    });
};

exports.updateEntity = (updatingObject, entityName, condition, primaryId, updateDisableColumns, result) => {
    const queryAndValueGenerator = queryAndValueGeneratorFunc(updatingObject, updateDisableColumns);
    const sqlQuery = "UPDATE " + entityName + " SET " + queryAndValueGenerator.query + " WHERE " + condition;
    const values = queryAndValueGenerator.values;
    poolConnection.query(
        sqlQuery, values, (err, res) => {
            if (err) {
                console.log("updating " + entityName + " failed with error: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                result({kind: "not_found"}, null);
                return;
            }
            console.log("updated " + entityName + " Id: ", primaryId);
            result(null, {id: primaryId});
        }
    );
};

exports.findOne = (entityName, primaryKey, primaryId, result) => {
    const sqlQuery = `SELECT * FROM  ${entityName} WHERE ${primaryKey} = ${primaryId}`;
    poolConnection.query(sqlQuery, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        if (res.length) {
            console.log("found customer: ", res[0]);
            result(null, res[0]);
            return;
        }
        result({kind: "not_found"}, null);
    });
};

exports.search = (SELECT_SQL, COUNT_SQL, result) => {
    poolConnection.query(SELECT_SQL, (err, res) => {
        if (err) {
            result(null, err);
        } else {
            poolConnection.query(COUNT_SQL, (err2, res2) => {
                if (err2) {
                    result(null, err2);
                    return;
                }
                if (res2.length) {
                    result(null, {data: res, ct: res2[0].ct});
                    return;
                }
                result({kind: "not_found"}, null);
            });
        }
    });
};