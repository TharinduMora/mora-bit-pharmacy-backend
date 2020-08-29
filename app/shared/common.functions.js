const dynamicResponse = require("../shared/dynamic.response");

exports.queryAndValueGenerator = function (loopingObject, updateDisableColumns) {
    let query = " ";
    let value = [];
    Object.keys(loopingObject).forEach(function (key) {
        if (loopingObject[key] != undefined && !updateDisableColumns.includes(key)) {
            query = query + key + " = ? , ";
            value.push(loopingObject[key])
        }
    });
    query = query.slice(0, query.lastIndexOf(","));

    return {
        query: query,
        values: value
    };
};

exports.isValidObject = function (entity, requiredFields, res) {
    let isValid = true;
    Object.keys(entity).forEach(function (key) {
        if ((entity[key] == undefined || entity[key] == null) && requiredFields.includes(key)) {
            isValid = false;
        }
    });
    return isValid;
};