const dynamicResponse = require("../shared/dynamic.response");
const payloadChecker = require('payload-validator');

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

exports.requestValidator = function (reqBody, api, mandatoryColumns, blankValues, res) {
    if (!reqBody) {
        res.status(400).send(dynamicResponse.error({message: "Content can not be empty!"}));
        return false;
    }
    const requestPayloadChecker = payloadChecker.validator(reqBody, api, mandatoryColumns, blankValues);
    if (!requestPayloadChecker.success) {
        res.status(400).send(dynamicResponse.error({message: requestPayloadChecker.response.errorMessage}));
        return false;
    }
    return true;
};

exports.authValidator = (functionId) => {
    return (req, res, next) => {
        req.admin = {
            functions: [1, 2]
        };
        if (req.admin.functions.includes(functionId)) {
            console.log("true");
            next();
        } else {
            console.log("false");
            res.status(401).send({unauthorized: true});
        }
    }

//     // My function
//     const myfunction = async function(x, y) {
//         return [
//             x,
//             y,
//         ];
//     }
//
// // Start function
//     const start = async function(a, b) {
//         const result = await myfunction('test', 'test');
//
//         console.log(result);
//     }
//
// // Call start
//     start();
};