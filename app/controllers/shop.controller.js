const Shop = require("../models/shop.model");
const commonFunctions = require("../shared/common.functions");
const dbOperations = require("../shared/database/db.operations");
const searchTemplate = require("../shared/search/search.template");

const ResponseFactory = require("../shared/dynamic.response.factory");

const SearchRequest = require("../shared/search/SearchRequest");

exports.create = (req, res) => {
    if (!commonFunctions.requestValidator(req.body, Shop.CREATE_API, Shop.creationMandatoryColumns, false, res))
        return;

    // Create a Shop
    const shop = new Shop({
        name: req.body.name,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        city: req.body.city
    });

    dbOperations.create(Shop.EntityName, shop, (err, data) => {
        if (err)
            res.status(500).send(ResponseFactory.getErrorResponse({message: err.message || "Some error occurred while creating the Shop."}));
        else
            res.send(ResponseFactory.getSuccessResponse({data: data, message: "Shop Created"}));
    });
};

exports.findAll = (req, res) => {

    let SELECT_SQL = `SELECT * FROM ${Shop.EntityName} `;
    let FILTER = ``;

    searchTemplate.dynamicDataOnlySearch(SELECT_SQL,FILTER,new SearchRequest({}),res);
};

exports.findOne = (req, res) => {
    dbOperations.findOne(Shop.EntityName, "id", req.params.shopId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
            } else {
                res.status(500).send(ResponseFactory.getErrorResponse({message: err.message || "Some error occurred while retrieving shop with Id:" + req.params.shopId}));
            }
        } else res.send(ResponseFactory.getSuccessResponse({data: data}));
    });
};

exports.update = (req, res) => {

    // Validate the Request
    if (!commonFunctions.requestValidator(req.body, Shop.UPDATE_API, Shop.updateMandatoryColumns, false, res))
        return;

    // Create Update Condition
    const updateCondition = ` id = ${req.body.id} `;

    let updatingShop = new Shop(req.body);

    dbOperations.updateEntity(new Shop(updatingShop), Shop.EntityName, updateCondition, req.body.id, Shop.updateRestrictedColumns, (err, data) => {///
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
            } else {
                res.status(500).send(ResponseFactory.getErrorResponse({message: err.message || "Shop Updating failed with Id:" + req.body.id}));
            }
        } else res.send(ResponseFactory.getSuccessResponse({id: req.body.id, message: "Successfully Updated!"}));
    });
};

exports.findByCriteria = (req, res) => {

    // Validate the Request
    // if (!commonFunctions.requestValidator(req.body, SearchRequest.API, [], false, res))
    //     return;

    let SELECT_SQL = `SELECT * FROM ${Shop.EntityName} `;
    let COUNT_SQL = `SELECT COUNT(id) AS ct FROM ${Shop.EntityName} `;
    let FILTER = '';

    let searchReq = new SearchRequest(req.body);

    searchTemplate.dynamicSearchWithCount(SELECT_SQL, COUNT_SQL, FILTER, searchReq, res);
    // searchTemplate.dynamicDataOnlySearch(SELECT_SQL, filter, searchReq, res);
};
