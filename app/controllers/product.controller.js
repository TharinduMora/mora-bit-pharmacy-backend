const Product = require("../models/product.model");
const ProductInventory = require("../models/product.inventory.model");
const commonFunctions = require("../shared/common.functions");
const dbOperations = require("../shared/database/db.operations");
const searchTemplate = require("../shared/search/search.template");
const SearchRequest = require("../shared/search/SearchRequest");
const mainConfig = require("../../app/config/main.config");
const ProductApiRequest = require("../APIs/request/product.api.request");
const ResponseFactory = require("../APIs/response/dynamic.response.factory");
const DbResponses = require("../APIs/response/db.response.factory");
const logger = require("../shared/logger/logger.module")("product.controller.js");

const dbTransaction = require("../shared/database/db.transaction.chain");

exports.create = async (req, res) => {
    // Validate the Request and reformat to api format
    if (!commonFunctions.validateRequestBody(req.body, ProductApiRequest.CREATE_API, true, res))
        return;

    if (!commonFunctions.isValidToProcess(req, res, req.body.shopId))
        return;

    let product = new Product({
        stockAvailable: req.body.stockAvailable,
        name: req.body.name,
        description: req.body.description,
        image: req.body.image
    });
    product.shopId = req.body.shopId;
    product.status = mainConfig.SYSTEM_STATUS.PENDING;

    const txn = dbTransaction.getTransaction();

    const productResponse = await txn.persist(Product, product);

    if (DbResponses.isSqlErrorResponse(productResponse.status)) {
        logger.error(productResponse.data.sqlMessage || "Internal Server Error!")
        res.status(500).send(ResponseFactory.getErrorResponse({message: productResponse.data.sqlMessage || "Internal Server Error!"}));
        return;
    }

    product = productResponse.data;

    let productInventory = new ProductInventory({
        price: req.body.price
    });

    if (product && product.id > 0) {
        productInventory.productId = product.id;
        productInventory.shopId = product.shopId;
    } else {
        logger.error("Product Id is not valid");
        res.status(500).send(ResponseFactory.getErrorResponse({message: "Internal Server Error!"}));
        txn.rollback();
        return;
    }

    const productInventoryResponse = await txn.persist(ProductInventory, productInventory);

    if (DbResponses.isSqlErrorResponse(productInventoryResponse.status)) {
        logger.error(productResponse.data.sqlMessage || "Internal Server Error!")
        res.status(500).send(ResponseFactory.getErrorResponse({message: productInventoryResponse.data.sqlMessage || "Internal Server Error!"}));
        return;
    }

    const queryResponse = await txn.commit();

    if (DbResponses.isRollback(queryResponse.status)) {
        logger.error(queryResponse.data.sqlMessage || "Internal Server Error!")
        res.status(500).send(ResponseFactory.getErrorResponse({message: queryResponse.data.sqlMessage || "Internal Server Error!"}));
        return;
    }

    logger.info("Product Created. Id: " + product.id);
    res.send(ResponseFactory.getSuccessResponse({
        data: {...product, price: productInventory.price},
        message: "Product Created"
    }));
};
