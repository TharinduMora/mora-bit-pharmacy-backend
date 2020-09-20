const Admin = require("../models/admin.model");
const commonFunctions = require("../shared/common.functions");
const dbOperations = require("../shared/database/db.operations");
const dbQueryGenFunctions = require("../shared/database/db.query.gen.function");
const searchTemplate = require("../shared/search/search.template");
const SearchRequest = require("../shared/search/SearchRequest");
const mainConfig = require("../../app/config/main.config");
const appRoles = require("../../app/config/app.role").APP_ROLES;

const ApiRequest = require("../APIs/request/api.request");
const ResponseFactory = require("../APIs/response/dynamic.response.factory");
const AdminApiResponse = require("../APIs/response/admin.api.response");
const DbResponses = require("../APIs/response/db.response.factory");

exports.create = async (req, res) => {
    if (!commonFunctions.requestValidator(req.body, ApiRequest.Admin.CREATE_API, Admin.creationMandatoryColumns, false, res))
        return;

    const ResultResponse = await dbOperations.getResultByQuery(Admin.NamedQuery.getAdminByUserName(req.body.userName));

    if (DbResponses.isSqlErrorResponse(ResultResponse.status)) {
        res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
        return;
    }
    if (DbResponses.isSuccessResponse(ResultResponse.status) && ResultResponse.data.length > 0) {
        res.status(400).send(ResponseFactory.getErrorResponse({message: 'User Name already exist'}));
        return;
    }

    const admin = new Admin({
        userName: req.body.userName,
        password: req.body.password,
        fullName: req.body.fullName,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        city: req.body.city
    });

    admin.roleId = appRoles.ROLE_1.ID;
    admin.adminType = mainConfig.ADMIN_TYPES.SYSTEM_ADMIN;
    admin.status = mainConfig.SYSTEM_STATUS.CREATED;

    const creationResponse = await dbOperations.create(Admin.EntityName, admin);

    if (DbResponses.isSqlErrorResponse(creationResponse.status)) {
        res.status(500).send(ResponseFactory.getErrorResponse({message: creationResponse.message || "Some error occurred while creating the Admin."}));
        return;
    }
    res.send(ResponseFactory.getSuccessResponse({
        data: AdminApiResponse.AdminCreationResponse(creationResponse.data),
        message: "Admin Created"
    }));
};

exports.login = async (req, res) => {
    if (!commonFunctions.requestValidator(req.body, ApiRequest.Admin.LOGIN_REQUEST, ["userName", "password"], false, res))
        return;

    const ResultResponse = await dbOperations.getResultByQuery(Admin.NamedQuery.getAdminByUserNameAndPassword(req.body.userName, req.body.password));

    if (DbResponses.isSqlErrorResponse(ResultResponse.status)) {
        res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
        return;
    }
    if (DbResponses.isDataNotFoundResponse(ResultResponse.status)) {
        res.status(401).send(ResponseFactory.getErrorResponse({message: 'Invalid username/password'}));
        return;
    }

    let admin = new Admin(ResultResponse.data[0]);
    admin.id = ResultResponse.data[0].id;
    admin.sessionId = commonFunctions.getSessionId();

    const updateResponse = dbOperations.updateEntity(admin, Admin.EntityName, `id = ${admin.id}`, admin.id, Admin.updateRestrictedColumns);

    if (DbResponses.isSqlErrorResponse(updateResponse.status)) {
        res.status(500).send(ResponseFactory.getErrorResponse({message: updateResponse.message || "Internal Server Error"}));
        return;
    }
    if (DbResponses.isDataNotFoundResponse(updateResponse.status)) {
        res.status(204).send();
        return;
    }

    res.status(200).send(ResponseFactory.getSuccessResponse({
        // data: new Admin.LoginResponse(admin),
        data: AdminApiResponse.AdminLoginResponse(admin),
        message: 'Login Success'
    }))
};

exports.findOne = async (req, res) => {
    const findResponse = dbOperations.findOne(Admin.EntityName, "id", req.params.adminId);

    if (DbResponses.isSqlErrorResponse(findResponse.status)) {
        res.status(500).send(ResponseFactory.getErrorResponse({message: findResponse.message || "Some error occurred while retrieving Admin with Id:" + req.params.adminId}));
        return;
    }
    if (DbResponses.isDataNotFoundResponse(findResponse.status)) {
        res.status(204).send();
        return;
    }

    res.send(ResponseFactory.getSuccessResponse({data: findResponse.data}));
};

exports.update = async (req, res) => {

    // Validate the Request
    if (!commonFunctions.requestValidator(req.body, ApiRequest.Admin.UPDATE_API, Admin.updateMandatoryColumns, false, res))
        return;

    // Create Update Condition
    const updateCondition = ` id = ${req.body.id} `;
    let updatingAdmin = new Admin(req.body);

    const updateResponse = await dbOperations.updateEntity(new Admin(updatingAdmin), Admin.EntityName, updateCondition, req.body.id, Admin.updateRestrictedColumns);

    if (DbResponses.isSqlErrorResponse(updateResponse.status)) {
        res.status(500).send(ResponseFactory.getErrorResponse({message: updateResponse.message || "Admin Updating failed with Id:" + req.body.id}));
        return;
    }
    if (DbResponses.isDataNotFoundResponse(updateResponse.status)) {
        res.status(204).send();
        return;
    }

    res.send(ResponseFactory.getSuccessResponse({id: req.body.id, message: "Successfully Updated!"}));
};

exports.findAll = (req, res) => {

    let SELECT_SQL = `SELECT * FROM ${Admin.EntityName} `;
    let FILTER = ``;
    let COLUMN_MAP = [];

    searchTemplate.dynamicDataOnlySearch(SELECT_SQL, FILTER, COLUMN_MAP, new SearchRequest({}), res);
};

exports.findByCriteria = (req, res) => {

    // Validate the Request
    // if (!commonFunctions.requestValidator(req.body, SearchRequest.API, [], false, res))
    //     return;

    let SELECT_SQL = `SELECT * FROM ${Admin.EntityName} `;
    let COUNT_SQL = `SELECT COUNT(id) AS ct FROM ${Admin.EntityName} `;
    let FILTER = '';
    let COLUMN_MAP = {
        userName: "userName",
        email: "email",
        telephone: "telephone",
        city: "city"
    };

    let searchReq = new SearchRequest(req.body);

    searchTemplate.dynamicSearchWithCount(SELECT_SQL, COUNT_SQL, FILTER, COLUMN_MAP, searchReq, res);
    // searchTemplate.dynamicDataOnlySearch(SELECT_SQL, FILTER,COLUMN_MAP, searchReq, res);
};

exports.transTest = (req, res) => {

    let transactionalQueryList = [];

    const admin = new Admin({
        userName: "Test",
        password: "Test",
        email: "Test Trans",
        telephone: "Test",
        address: "Test",
        city: "Test"
    });

    // passing queryId is must for getting result object
    const AdminUpdateQuery = dbQueryGenFunctions.getUpdateQuery(1, new Admin(req.body), Admin.EntityName, ` id = ${req.body.id} `, req.body.id, Admin.updateRestrictedColumns);
    const AdminInsertQuery = dbQueryGenFunctions.getInsertQuery(2, Admin.EntityName, admin);

    transactionalQueryList.push(AdminInsertQuery, AdminUpdateQuery);

    dbOperations.executeAsTransaction(transactionalQueryList, 'resMap_', (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result['resMap_' + 2]) {
                let newAdmin = {...admin};
                newAdmin.id = result['resMap_' + 2].insertId;
                res.send(newAdmin);
                return;
            }
            res.send("Success");
        }
    })
};
