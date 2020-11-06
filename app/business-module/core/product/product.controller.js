const ProductCreationResponse = require("./product.api.response").ProductCreationResponse;

const Product = require("../../models/product.model");
const ProductInventory = require("../../models/product.inventory.model");
const commonFunctions = require("../../shared/common.functions");
const dbOperations = require("../../shared/database/db.operations");
const searchTemplate = require("../../shared/search/search.template");
const SearchRequest = require("../../shared/search/SearchRequest");
const mainConfig = require("../../../config/main.config");
const ProductApiRequest = require("./product.api.request");
const ResponseFactory = require("../../shared/API/response/dynamic.response.factory");
const DbResponses = require("../../shared/API/response/db.response.factory");
const logger = require("../../shared/logger/logger.module")("product.controller.js");

const dbTransaction = require("../../shared/database/db.transaction.chain");

exports.create = async (req, res) => {

    try {
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
            data: ProductCreationResponse({...product, price: productInventory.price}),
            message: "Product Created"
        }));
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
    }

};

exports.update = async (req, res) =>{
    try{
        // Validate the Request and reformat to api format
        if (!commonFunctions.validateRequestBody(req.body, ProductApiRequest.UPDATE_API, true, res))
            return;

        if(!commonFunctions.isValidToProcess(req,res,req.body.shopId))
            return;

        const productResponse = await dbOperations.findOne(Product,req.body.id);

        if(DbResponses.isSqlErrorResponse(productResponse.status)){
            logger.error(productResponse.data.sqlMessage || "Internal Server Error!")
            res.status(500).send(ResponseFactory.getErrorResponse({message: productResponse.data.sqlMessage || "Internal Server Error!"}));
            return;
        }
        if (DbResponses.isDataNotFoundResponse(productResponse.status)) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Product not exist with id: " + req.body.id}));
            return;
        }
        let product = productResponse.data;

        const productInventoryResponse = await dbOperations.findOne(ProductInventory,req.body.id);

        if(DbResponses.isSqlErrorResponse(productInventoryResponse.status)){
            logger.error(productInventoryResponse.data.sqlMessage || "Internal Server Error!")
            res.status(500).send(ResponseFactory.getErrorResponse({message: productInventoryResponse.data.sqlMessage || "Internal Server Error!"}));
            return;
        }
        if (DbResponses.isDataNotFoundResponse(productInventoryResponse.status)) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Product Inventory not exist with id: " + req.body.id}));
            return;
        }
        let productInventory = productInventoryResponse.data;

        product.name = req.body.name;
        product.description = req.body.description;
        product.image = req.body.image;
        product.stockAvailable = req.body.stockAvailable;

        productInventory.price = req.body.price;

        const txn = dbTransaction.getTransaction();
        const productUpdateResponse = await txn.merge(Product, product);

        if (DbResponses.isSqlErrorResponse(productUpdateResponse.status)) {
            logger.error(productUpdateResponse.data.sqlMessage || "Internal Server Error!")
            res.status(500).send(ResponseFactory.getErrorResponse({message: productUpdateResponse.data.sqlMessage || "Internal Server Error!"}));
            return;
        }

        const productInventoryUpdateResponse = await txn.merge(ProductInventory, productInventory);

        if (DbResponses.isSqlErrorResponse(productInventoryUpdateResponse.status)) {
            logger.error(productUpdateResponse.data.sqlMessage || "Internal Server Error!")
            res.status(500).send(ResponseFactory.getErrorResponse({message: productInventoryUpdateResponse.data.sqlMessage || "Internal Server Error!"}));
            return;
        }

        const queryResponse = await txn.commit();

        if (DbResponses.isRollback(queryResponse.status)) {
            logger.error(queryResponse.data.sqlMessage || "Internal Server Error!")
            res.status(500).send(ResponseFactory.getErrorResponse({message: queryResponse.data.sqlMessage || "Internal Server Error!"}));
            return;
        }

        logger.info('Product Updated: Id: ' + req.body.id);
        res.send(ResponseFactory.getSuccessResponse({id: req.body.id, message: "Successfully Updated!"}));

    }catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
    }
}

exports.findByCriteria = (req, res) => {
    try {
        if (!commonFunctions.isValidToProcess(req, res, req.body.shopId))
            return;

        let SELECT_SQL = `SELECT * FROM ${Product.EntityName} A JOIN ${ProductInventory.EntityName} B ON A.id = B.productId `;
        let COUNT_SQL = `SELECT COUNT(id) AS ct FROM ${Product.EntityName} A JOIN ${ProductInventory.EntityName} B ON A.id = B.productId `;
        let FILTER = ' AND A.shopId = ' + req.body.shopId;
        let COLUMN_MAP = {
            name: "A.name"
        };
        let MAPPER = {
            id: "id",
            shopId: "shopId",
            status: "status",
            stockAvailable: "stockAvailable",
            name: "name",
            description: "description",
            image: "image",
            price: "price"
        };

        let searchReq = new SearchRequest(req.body);
        searchTemplate.dynamicSearchWithCount(SELECT_SQL, COUNT_SQL, FILTER, COLUMN_MAP, null, searchReq, res);
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
    }
};
