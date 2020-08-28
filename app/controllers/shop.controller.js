const Shop = require("../models/shop.model");
const dynamicResponse = require("../shared/dynamic.response");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send(dynamicResponse.error({message: "Content can not be empty!"}));
    }

    // Create a Customer
    const shop = new Shop({
        name: req.body.name,
        email: req.body.email,
        telephone: req.body.telephone,
        address: req.body.address,
        city: req.body.city
    });

    Shop.create(shop, (err, data) => {
        if (err)
            res.status(500).send(dynamicResponse.error({message: err.message || "Some error occurred while creating the Shop."}));
        else
            res.send(dynamicResponse.success({data: data, message: "Shop Created"}));
    });

};

// Retrieve all Customers from the database.
exports.findAll = (req, res) => {
    Shop.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving customers."
            });
        // else res.send(dynamicResponse.searchResponse({data: data, recordCount: data.length}));
        else res.send(data);
    });
};

// Find a single Customer with a customerId
exports.findOne = (req, res) => {
    Customer.findById(req.params.customerId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Customer with id ${req.params.customerId}.`
                });
            } else {
                res.status(500).send({
                    message: "Error retrieving Customer with id " + req.params.customerId
                });
            }
        } else res.send(data);
    });
};

// Update a Customer identified by the customerId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send(dynamicResponse.error({message: "Content can not be empty!"}));
    }

    Shop.updateById(
        req.params.shopId,
        new Shop(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(204).send({});
                } else {
                    res.status(500).send(dynamicResponse.error({message: err || "Shop Updating failed with Id:" + req.params.shopId}));
                }
            } else res.send(dynamicResponse.success({id: req.params.shopId, message: "Successfully Updated!"}));
        }
    );
};

// Delete a Customer with the specified customerId in the request
exports.delete = (req, res) => {
    Customer.remove(req.params.customerId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Customer with id ${req.params.customerId}.`
                });
            } else {
                res.status(500).send({
                    message: "Could not delete Customer with id " + req.params.customerId
                });
            }
        } else res.send({message: `Customer was deleted successfully!`});
    });
};

// Delete all Customers from the database.
exports.deleteAll = (req, res) => {
    Customer.removeAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while removing all customers."
            });
        else res.send({message: `All Customers were deleted successfully!`});
    });
};
