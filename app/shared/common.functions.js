const dynamicResponse = require("../shared/dynamic.response");
const payloadChecker = require('payload-validator');
const {APP_ROLES} = require("../../app.role");

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
            roleId: 1
        };

        let role = APP_ROLES["ROLE_"+req.admin.roleId];

        if(!role){
            res.status(401).send({ message: "Invalid Role Id : " +  req.admin.roleId });
            return ;
        }

        if (role.FUNCTIONS.includes(functionId)) {
            next();
        } else {
            res.status(401).send({ unauthorized: true });
        }
    }
};