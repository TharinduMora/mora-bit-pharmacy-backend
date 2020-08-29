const Shop = require("../models/shop.model");
const dynamicResponse = require("../shared/dynamic.response");
const commonFunctions = require("../shared/common.functions");
const dbOperations = require("../shared/db.operations");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send(dynamicResponse.error({message: "Content can not be empty!"}));
    }
    // Create a Shop
    const shop = new Shop({
        name: req.body.name,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        city: req.body.city
    });

    // Create a Shop Object
    if (!commonFunctions.isValidObject(req.body, Shop.reqiredColumns, res)) {
        res.status(400).send(dynamicResponse.error({message: "Bad Request"}));
        return;
    }

    dbOperations.create("shops", shop, (err, data) => {
        if (err)
            res.status(500).send(dynamicResponse.error({message: err.message || "Some error occurred while creating the Shop."}));
        else
            res.send(dynamicResponse.success({data: data, message: "Shop Created"}));
    });
};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    let SELECT_SQL = "SELECT * FROM shops LIMIT 0,3 ";
    let COUNT_SQL = "SELECT COUNT(id) AS ct FROM shops ";
    dbOperations.search(SELECT_SQL, COUNT_SQL, (err, searchresult) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
                return;
            }
            res.status(500).send(dynamicResponse.error({message: err.message || "Some error occurred while retrieving shops."}));
        } else {
            res.send(dynamicResponse.searchResponse({recordCount: searchresult.ct, data: searchresult.data}));
        }
    })
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
    dbOperations.findOne("shops", "id", req.params.shopId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
            } else {
                res.status(500).send(dynamicResponse.error({message: err.message || "Some error occurred while retrieving shop with Id:" + req.params.shopId}));
            }
        } else res.send(dynamicResponse.success({data: data}));
    });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send(dynamicResponse.error({message: "Content can not be empty!"}));
    }

    const updateCondition = "id = " + req.params.shopId;
    dbOperations.updateEntity(new Shop(req.body), "shops", updateCondition, req.params.shopId, Shop.updateDisableColumns, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
            } else {
                res.status(500).send(dynamicResponse.error({message: err.message || "Shop Updating failed with Id:" + req.params.shopId}));
            }
        } else res.send(dynamicResponse.success({id: req.params.shopId, message: "Successfully Updated!"}));
    });
};
