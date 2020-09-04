const poolConnection = require("../database/db.pool");

exports.findByCriteria = (SELECT_SQL, COUNT_SQL, searchRequest, result) => {
    // if (searchRequest instanceof this.searchRequest) {
    //     console.log(true);
    // }
    SELECT_SQL = SELECT_SQL + generateWhere(searchRequest) + generateLimit(searchRequest);
    COUNT_SQL = COUNT_SQL + generateWhere(searchRequest);

    console.log(SELECT_SQL);

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

}

function generateWhere(searchRequest) {
    let initQuery = ' WHERE 1=1 ';
    let conditions = " ";
    if (searchRequest.searchKeys != null && searchRequest.searchKeys.length > 0) {
        for (let i = 0; i < searchRequest.searchKeys.length; i++) {
            conditions = appendCondition(searchRequest.searchKeys[i], searchRequest.operators[i], searchRequest.values[i], conditions);
        }
    }
    return initQuery + conditions;
}

function generateLimit(searchRequest) {
    let condition = '';
    let offset = 0;
    let limit = 10;

    if (searchRequest.offset)
        offset = searchRequest.offset;
    if (searchRequest.limit)
        limit = searchRequest.limit;

    condition = ` LIMIT ${searchRequest.offset},${searchRequest.limit}`;
    return condition;
}

function appendCondition(key, operator, value, where) {
    switch (operator) {
        case "=":
        case "eq": {
            where = where + ` AND ${key} = ${value}`;
            if (value.constructor === Number) {
                where = where + ` AND ${key} = ${value}`;
            } else if (value.constructor === String) {
                if (value === "true" || value === "false")
                    where = where + ` AND ${key} IS ${value}`;
                else
                    where = where + ` AND ${key} = ${value}`;
            } else {
                where = where + ` AND ${key} = ${value}`;
            }
            break;
        }
        case "like": {
            where = where + ` AND ${key} LIKE '%${value}%' `;
            break;
        }
        case "%like": {
            where = where + ` AND ${key} LIKE '%${value}' `;
            break;
        }
        case "like%": {
            where = where + ` AND ${key} LIKE '${value}%' `;
            break;
        }
        case ">":
        case "gt": {
            if (value.constructor === Number)
                where = where + ` AND ${key} > ${value} `;
            else
                where = where + ` AND ${key} > '${value}' `;
            break;
        }
        case "<":
        case "lt": {
            if (value.constructor === Number)
                where = where + ` AND ${key} < ${value} `;
            else
                where = where + ` AND ${key} < '${value}' `;
            break;
        }
        case ">=":
        case "gte": {
            if (value.constructor === Number)
                where = where + ` AND ${key} >= ${value} `;
            else
                where = where + ` AND ${key} >= '${value}' `;
            break;
        }
        case "<=":
        case "lte": {
            if (value.constructor === Number)
                where = where + ` AND ${key} <= ${value} `;
            else
                where = where + ` AND ${key} <= '${value}' `;
            break;
        }
        case "in": {
            where = where + ` AND ${key} IN ( ${value} ) `;
            break;
        }
        default:
            break;
    }
    return where;
}