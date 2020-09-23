const payloadChecker = require('payload-validator');
const sessionStore = require("./session.store")
const {APP_ROLES} = require("../../app/config/app.role");
const dbOperations = require("./database/db.operations");
const Admin = require("../models/admin.model");
const ResponseFactory = require("../APIs/response/dynamic.response.factory");

exports.requestValidator = function (reqBody, api, mandatoryColumns, blankValues, res) {
    if (!reqBody) {
        res.status(400).send(ResponseFactory.getErrorResponse({message: "Content can not be empty!"}));
        return false;
    }
    const requestPayloadChecker = payloadChecker.validator(reqBody, api, mandatoryColumns, blankValues);
    if (!requestPayloadChecker.success) {
        res.status(400).send(ResponseFactory.getErrorResponse({message: requestPayloadChecker.response.errorMessage}));
        return false;
    }
    for(const key in reqBody){
        if(!api.hasOwnProperty(key)){
            delete reqBody[key];
        }
    }
    return true;
};

exports.authValidator = (functionId) => {
    return (req, res, next) => {
        const sessionId = req.header('sessionId');
        if (sessionId === undefined) {
            res.status(401).send(ResponseFactory.getErrorResponse({message: 'SessionId undefined.'}));
            return;
        }
        if (sessionStore.getAdminSession(sessionId)) {
            req.admin = sessionStore.getAdminSession(sessionId);
            validateUser(req, res, next);
        } else {
            dbOperations.getResultByQueryAsCallback(Admin.NamedQuery.getAdminBySessionId(sessionId), (err, result) => {
                if (err) {
                    if (err.kind === 'not_found') {
                        res.status(401).send(ResponseFactory.getErrorResponse({message: 'Unauthorized User'}));
                        return;
                    }
                    res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
                } else if (result) {
                    const admin = result.data[0];
                    sessionStore.addAdminSession(admin.sessionId, admin);
                    req.admin = admin;
                    validateUser(req, res, next);
                }
            })
        }

        function validateUser(req, res, next) {
            let role = APP_ROLES["ROLE_" + req.admin.roleId];

            if (!role) {
                res.status(401).send(ResponseFactory.getErrorResponse({message: "Invalid Role Id : " + req.admin.roleId}));
                return;
            }

            if (role.FUNCTIONS.includes(functionId)) {
                next();
            } else {
                res.status(401).send(ResponseFactory.getErrorResponse({message: 'Unauthorized User'}));
            }
        }
    }
};

exports.isValidToProcess = (req,res,entityShopId) => {
    if(req.admin && req.admin.shopId === entityShopId){
         return true;
    }else{
        res.status(401).send(ResponseFactory.getErrorResponse({message: 'Unauthorized User'}));
        return false;
    }
};

exports.getSessionId = function () {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 36; i++) {
        if (i === 18) {
            result += new Date().getTime();
        }
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};