const Shop = require("../models/shop.model");
const dynamicResponse = require("../shared/dynamic.response");
const commonFunctions = require("../shared/common.functions");
const dbOperations = require("../shared/database/db.operations");
const searchTemplate = require("../shared/search/search.template");

const SearchRequest = require("../shared/search/SearchRequest")


// Create and Save a new Customer
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
            res.status(500).send(dynamicResponse.error({ message: err.message || "Some error occurred while creating the Shop." }));
        else
            res.send(dynamicResponse.success({ data: data, message: "Shop Created" }));
    });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {

    let SELECT_SQL = `SELECT * FROM ${Shop.EntityName} LIMIT 0,3 `;
    let COUNT_SQL = `SELECT COUNT(id) AS ct FROM ${Shop.EntityName} `;

    dbOperations.search(SELECT_SQL, COUNT_SQL, (err, searchResult) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
                return;
            }
            res.status(500).send(dynamicResponse.error({ message: err.message || "Some error occurred while retrieving shops." }));
        } else {
            res.send(dynamicResponse.searchResponse({ recordCount: searchResult.ct, data: searchResult.data }));
        }
    })
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
    dbOperations.findOne(Shop.EntityName, "id", req.params.shopId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
            } else {
                res.status(500).send(dynamicResponse.error({ message: err.message || "Some error occurred while retrieving shop with Id:" + req.params.shopId }));
            }
        } else res.send(dynamicResponse.success({ data: data }));
    });
};

exports.update = (req, res) => {

    // Validate the Request
    if (!commonFunctions.requestValidator(req.body, Shop.UPDATE_API, Shop.updateMandatoryColumns, false, res))
        return;

    // Create Update Condition
    const updateCondition = ` id = ${req.body.id} `;

    let updatingShop = new Shop(req.body);

    dbOperations.updateEntity(new Shop(updatingShop), Shop.EntityName, updateCondition, req.body.id, Shop.updateRestrictedColumns, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
            } else {
                res.status(500).send(dynamicResponse.error({ message: err.message || "Shop Updating failed with Id:" + req.body.id }));
            }
        } else res.send(dynamicResponse.success({ id: req.body.id, message: "Successfully Updated!" }));
    });
};

exports.findByCriteria = (req, res) => {

    // Validate the Request
    if (!commonFunctions.requestValidator(req.body, SearchRequest.API, [], false, res))
        return;

    let SELECT_SQL = `SELECT * FROM ${Shop.EntityName} `;
    let COUNT_SQL = `SELECT COUNT(id) AS ct FROM ${Shop.EntityName} `;

    let searchReq = new SearchRequest(req.body);

    searchTemplate.findByCriteria(SELECT_SQL, COUNT_SQL, searchReq, (err, searchResult) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
                return;
            }
            res.status(500).send(dynamicResponse.error({ message: err.message || "Some error occurred while retrieving shops." }));
        } else {
            res.send(dynamicResponse.searchResponse({ recordCount: searchResult.ct, data: searchResult.data }));
        }
    })
};
