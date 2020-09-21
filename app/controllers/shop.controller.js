const Shop = require("../models/shop.model");
const commonFunctions = require("../shared/common.functions");
const dbOperations = require("../shared/database/db.operations");
const searchTemplate = require("../shared/search/search.template");
const SearchRequest = require("../shared/search/SearchRequest");
const mainConfig = require("../../app/config/main.config");

const ApiRequest = require("../APIs/request/api.request");
const ResponseFactory = require("../APIs/response/dynamic.response.factory");
const ShopApiResponse = require("../APIs/response/shop.api.response");
const DbResponses = require("../APIs/response/db.response.factory");

const logger = require("../shared/logger/logger.module")("shop.controller.js");

exports.create = async (req, res) => {
    if (!commonFunctions.requestValidator(req.body, ApiRequest.Shop.CREATE_API, Shop.creationMandatoryColumns, false, res))
        return;

    const shop = new Shop(req.body);
    shop.status = mainConfig.SYSTEM_STATUS.CREATED;

    const creationResponse = await dbOperations.create(Shop.EntityName, shop);

    if (DbResponses.isSqlErrorResponse(creationResponse.status)) {
        res.status(500).send(ResponseFactory.getErrorResponse({message: creationResponse.message || "Some error occurred while creating the Shop."}));
        return;
    }
    logger.info("Shop Created. Id: " + creationResponse.data.id);
    res.send(ResponseFactory.getSuccessResponse({
        data: ShopApiResponse.ShopCreationResponse(creationResponse.data),
        message: "Shop Created"
    }));
};

exports.findOne = async (req, res) => {
    const findResponse = dbOperations.findOne(Shop.EntityName, "id", req.params.shopId);

    if (DbResponses.isSqlErrorResponse(findResponse.status)) {
        res.status(500).send(ResponseFactory.getErrorResponse({message: findResponse.message || "Some error occurred while retrieving Shop with Id:" + req.params.shopId}));
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
    if (!commonFunctions.requestValidator(req.body, ApiRequest.Shop.UPDATE_API, Shop.updateMandatoryColumns, false, res))
        return;

    // Create Update Condition
    const updateCondition = ` id = ${req.body.id} `;
    let updatingShop = new Shop(req.body);

    const updateResponse = await dbOperations.updateEntity(new Shop(updatingShop), Shop.EntityName, updateCondition, req.body.id, Shop.updateRestrictedColumns);

    if (DbResponses.isSqlErrorResponse(updateResponse.status)) {
        res.status(500).send(ResponseFactory.getErrorResponse({message: updateResponse.message || "Shop Updating failed with Id:" + req.body.id}));
        return;
    }
    if (DbResponses.isDataNotFoundResponse(updateResponse.status)) {
        res.status(204).send();
        return;
    }

    logger.info('Shop Updated: Id: ' + updatingShop.id);
    res.send(ResponseFactory.getSuccessResponse({id: req.body.id, message: "Successfully Updated!"}));
};

exports.findAll = (req, res) => {

    let SELECT_SQL = `SELECT * FROM ${Shop.EntityName} `;
    let FILTER = ``;
    let COLUMN_MAP = [];

    searchTemplate.dynamicDataOnlySearch(SELECT_SQL, FILTER, COLUMN_MAP, new SearchRequest({}), res);
};

exports.findByCriteria = (req, res) => {

    // Validate the Request
    // if (!commonFunctions.requestValidator(req.body, SearchRequest.API, [], false, res))
    //     return;

    let SELECT_SQL = `SELECT * FROM ${Shop.EntityName} `;
    let COUNT_SQL = `SELECT COUNT(id) AS ct FROM ${Shop.EntityName} `;
    let FILTER = '';
    let COLUMN_MAP = {
        name: "name",
        email: "email",
        telephone: "telephone",
        city: "city"
    };

    let searchReq = new SearchRequest(req.body);

    searchTemplate.dynamicSearchWithCount(SELECT_SQL, COUNT_SQL, FILTER, COLUMN_MAP, searchReq, res);
    // searchTemplate.dynamicDataOnlySearch(SELECT_SQL, FILTER,COLUMN_MAP, searchReq, res);
};

// exports.createSh = (req, res) => {
//
//     let transactionalQueryList = [];
//
//     const admin = new Admin({
//         userName: "Test",
//         password: "Test",
//         email: "Test Trans",
//         telephone: "Test",
//         address: "Test",
//         city: "Test"
//     });
//
//     // passing queryId is must for getting result object
//     const AdminUpdateQuery = dbQueryGenFunctions.getUpdateQuery(1, new Admin(req.body), Admin.EntityName, ` id = ${req.body.id} `, req.body.id, Admin.updateRestrictedColumns);
//     const AdminInsertQuery = dbQueryGenFunctions.getInsertQuery(2, Admin.EntityName, admin);
//
//     transactionalQueryList.push(AdminInsertQuery, AdminUpdateQuery);
//
//     dbOperations.executeAsTransaction(transactionalQueryList, 'resMap_', (err, result) => {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             if (result['resMap_' + 2]) {
//                 let newAdmin = {...admin};
//                 newAdmin.id = result['resMap_' + 2].insertId;
//                 res.send(newAdmin);
//                 return;
//             }
//             res.send("Success");
//         }
//     })
// };