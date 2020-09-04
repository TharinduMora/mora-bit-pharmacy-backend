const dynamicResponse = require("../shared/dynamic.response");
const payloadChecker = require('payload-validator');

exports.queryAndValueGenerator = function (loopingObject, updateDisableColumns) {
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
};

exports.requestValidator = function (reqBody, api, mandatoryColumns, blankValues, res) {
    if (!reqBody) {
        res.status(400).send(dynamicResponse.error({ message: "Content can not be empty!" }));
        return false;
    }
    const requestPayloadChecker = payloadChecker.validator(reqBody, api, mandatoryColumns, blankValues);
    if (!requestPayloadChecker.success) {
        res.status(400).send(dynamicResponse.error({ message: requestPayloadChecker.response.errorMessage }));
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
            res.status(401).send({ unauthorized: true });
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



// -- 1. start a new transaction
// START TRANSACTION;
//
// -- 2. Get the latest order number
// SELECT
// @orderNumber:=MAX(orderNUmber)+1
// FROM
// orders;
//
// -- 3. insert a new order for customer 145
// INSERT INTO orders(orderNumber,
//     orderDate,
//     requiredDate,
//     shippedDate,
//     status,
//     customerNumber)
// VALUES(@orderNumber,
//     '2005-05-31',
//     '2005-06-10',
//     '2005-06-11',
//     'In Process',
//     145);
//
// -- 4. Insert order line items
// INSERT INTO orderdetails(orderNumber,
//     productCode,
//     quantityOrdered,
//     priceEach,
//     orderLineNumber)
// VALUES(@orderNumber,'S18_1749', 30, '136', 1),
//     (@orderNumber,'S18_2248', 50, '55.09', 2);
//
// -- 5. commit changes
// COMMIT;

// or ROLLBACK;