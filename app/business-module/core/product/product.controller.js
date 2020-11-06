const ProductCreationResponse = require("./product.api.response").ProductCreationResponse;

const Product = require("../../models/product.model");
const ProductInventory = require("../../models/product.inventory.model");
const mainConfig = require("../../../config/main.config");
const ProductApiRequest = require("./product.api.request");

const commonFunctions = require("../../common/common.functions");
const searchTemplate = require("../../common/search/search.template");
const SearchRequest = require("../../common/search/SearchRequest");
const ApiRequest = require("../../common/api/request/common.api.request");
const ResponseFactory = require("../../common/api/response/dynamic.response.factory");
const EntityManager = require("../../../shared/database/mysql/api/entity.manager")

const logger = require("../../../shared/logger/logger.module")("product.controller.js");

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

        let productInventory = new ProductInventory({
            price: req.body.price
        });

        const txn = await EntityManager.getTransaction();

        product = await txn.persist(Product, product);

        productInventory.productId = product.id;
        productInventory.shopId = product.shopId;

        productInventory = await txn.persist(ProductInventory, productInventory);

        await txn.commit();

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

exports.updateStatus = async (req, res) => {

    try {
        // Validate the Request
        if (!commonFunctions.validateRequestBody(req.body, ApiRequest.STATUS_UPDATE_API, false, res))
            return;

        if (!commonFunctions.isValidToProcess(req, res, req.body.shopId))
            return;

        let product = await EntityManager.findOne(Product, req.body.primaryId);

        if (!product) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Shop not exist with id: " + req.body.id}));
            return;
        }

        product.status = req.body.status;

        const updateResponse = await EntityManager.updateOne(Product, product);

        if (!updateResponse) {
            logger.error("Product updating failed with id : " + req.body.id);
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Product updating failed with id : " + req.body.id}));
            return;
        }

        logger.info('Product Status Updated: Id: ' + req.body.primaryId);
        res.send(ResponseFactory.getSuccessResponse({
            id: req.body.primaryId,
            message: "Successfully Updated the Product status!"
        }));
    } catch (e) {
        logger.error(e || null);
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

        let product = await EntityManager.findOne(Product,req.body.id);

        if (!product) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Product not exist with id: " + req.body.id}));
            return;
        }

        let productInventory = await EntityManager.findOne(ProductInventory,req.body.id);

        if (!productInventory) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Product Inventory not exist with id: " + req.body.id}));
            return;
        }

        product.name = req.body.name;
        product.description = req.body.description;
        product.image = req.body.image;
        product.stockAvailable = req.body.stockAvailable;

        productInventory.price = req.body.price;

        const txn = EntityManager.getTransaction();

        await txn.merge(Product, product);

        await txn.merge(ProductInventory, productInventory);

        await txn.commit();

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
        searchTemplate.dynamicSearchWithCount(SELECT_SQL, COUNT_SQL, FILTER, COLUMN_MAP, MAPPER, searchReq, res);
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
    }
};
