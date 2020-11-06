const Admin = require("../../models/admin.model");
const Shop = require("../../models/shop.model");
const commonFunctions = require("../../common/common.functions");
const searchTemplate = require("../../common/search/search.template");
const SearchRequest = require("../../common/search/SearchRequest");
const mainConfig = require("../../../config/main.config");
const appRoles = require("../../../config/app.role").APP_ROLES;
const EntityManager = require("../../../shared/database/mysql/api/entity.manager")

const AdminApiRequest = require("./admin.api.request");
const ResponseFactory = require("../../common/api/response/dynamic.response.factory");
const AdminApiResponse = require("./admin.api.response");
const sessionStore = require("../../common/session.store");
const logger = require("../../../shared/logger/logger.module")("admin.controller.js");

exports.create = async (req, res) => {
    try {
        // Validate the Request and reformat to api format
        if (!commonFunctions.validateRequestBody(req.body, AdminApiRequest.CREATE_API, false, res))
            return;

        const AdminList = await EntityManager.getResultByQuery(Admin.NamedQuery.getAdminByUserName(req.body.userName));

        if (AdminList.length > 0) {
            logger.info("User Name already exist. username: " + req.body.userName);
            res.status(400).send(ResponseFactory.getErrorResponse({message: 'User Name already exist'}));
            return;
        }

        let admin = new Admin({
            userName: req.body.userName,
            password: req.body.password,
            fullName: req.body.fullName,
            email: req.body.email,
            telephone: req.body.telephone,
            address: req.body.address,
            city: req.body.city
        });
        admin.shopId = req.body.shopId;
        if (req.body.shopId > 1) {
            admin.systemAdmin = false;
            admin.roleId = appRoles[1].ID;
        } else {
            admin.systemAdmin = true;
            admin.roleId = appRoles[0].ID;
        }
        admin.status = mainConfig.SYSTEM_STATUS.CREATED;

        admin = await EntityManager.insertOne(Admin, admin);

        logger.info("Admin Created. Id: " + admin.id);
        res.send(ResponseFactory.getSuccessResponse({
            data: AdminApiResponse.AdminCreationResponse(admin),
            message: "Admin Created"
        }));
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: "Internal Server Error"}));
    }
};

exports.update = async (req, res) => {

    try {
        // Validate the Request and reformat to api format
        if (!commonFunctions.validateRequestBody(req.body, AdminApiRequest.UPDATE_API, false, res))
            return;

        if (!req.admin.systemAdmin && req.admin.id !== req.body.id) {
            res.status(401).send(ResponseFactory.getErrorResponse({message: 'Invalidate User to current action.'}));
        }

        let admin = await EntityManager.findOne(Admin, req.body.id);

        if (admin === null) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Admin not exist with id: " + req.body.id}));
            return;
        }

        admin.fullName = req.body.fullName;
        admin.telephone = req.body.telephone;
        admin.address = req.body.address;
        admin.city = req.body.city;

        if (!commonFunctions.isValidToProcess(req, res, admin.shopId))
            return;

        const updateResponse = await EntityManager.updateOne(Admin, admin);

        if (updateResponse === null) {
            res.status(500).send(ResponseFactory.getErrorResponse({id: req.body.id, message: "Admin Not found!"}));
            return;
        }
        logger.info('Admin Updated: Id: ' + req.body.id);
        res.send(ResponseFactory.getSuccessResponse({id: req.body.id, message: "Successfully Updated!"}));
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: "Internal Server Error"}));
    }
};

exports.login = async (req, res) => {
    try {
        // Validate the Request and reformat to api format
        if (!commonFunctions.validateRequestBody(req.body, AdminApiRequest.LOGIN_REQUEST, false, res))
            return;

        const AdminList = await EntityManager.getResultByQuery(Admin.NamedQuery.getAdminByUserNameAndPassword(req.body.userName, req.body.password));

        if (AdminList.length === 0) {
            res.status(401).send(ResponseFactory.getErrorResponse({message: 'Invalid username/password'}));
            return;
        }

        let admin = new Admin(AdminList[0]);

        admin.sessionId = commonFunctions.getSessionId();

        const shop = await EntityManager.findOne(Shop, admin.shopId);

        if (shop === null) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Shop Not Found"}));
            return;
        } else if (shop.status !== mainConfig.SYSTEM_STATUS.APPROVED) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Shop not approved"}));
            return;
        }

        const updateResponse = await EntityManager.updateOne(Admin, admin);

        if (updateResponse === null) {
            logger.error("Session Id Updating failed. AdminId :" + admin.id);
            res.status(204).send();
            return;
        }

        sessionStore.addAdminSession(admin.sessionId, AdminApiResponse.AdminLoginResponse(admin));

        let roles = appRoles.filter((r) => {
            return r.ID === admin.roleId
        });

        admin.functions = roles[0].FUNCTIONS;

        logger.info('Admin Login Success: Id: ' + admin.id + " with sessionId: " + admin.sessionId);
        res.status(200).send(ResponseFactory.getSuccessResponse({
            data: AdminApiResponse.AdminLoginResponse(admin),
            message: 'Login Success'
        }))
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
    }
};

exports.findOne = async (req, res) => {
    const admin = EntityManager.findOne(Admin, req.params.adminId);

    if (admin === null) {
        res.status(204).send();
        return;
    }
    res.send(ResponseFactory.getSuccessResponse({data: admin}));
};

exports.findAll = (req, res) => {

    let SELECT_SQL = `SELECT * FROM ${Admin.EntityName} `;
    let FILTER = ``;
    let COLUMN_MAP = [];

    searchTemplate.dynamicDataOnlySearch(SELECT_SQL, FILTER, COLUMN_MAP, null, new SearchRequest({}), res);
};

exports.findByCriteria = (req, res) => {
    try {
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

        searchTemplate.dynamicSearchWithCount(SELECT_SQL, COUNT_SQL, FILTER, COLUMN_MAP, null, searchReq, res);
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
    }
    // searchTemplate.dynamicDataOnlySearch(SELECT_SQL, FILTER,COLUMN_MAP, searchReq, res);
};
