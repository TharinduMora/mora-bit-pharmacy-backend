const Shop = require("../../models/shop.model");
const Product = require("../../models/product.model");
const Admin = require("../../models/admin.model");
const ShopApiResponse = require("./shop.api.response");
const ShopApiRequest = require("./shop.api.request");

const commonFunctions = require("../../common/common.functions");
const searchTemplate = require("../../common/search/search.template");
const mainConfig = require("../../../config/main.config");
const EntityManager = require("../../../shared/database/mysql/api/entity.manager");
const SearchRequest = require("../../common/search/SearchRequest");
const ApiRequest = require("../../common/api/request/common.api.request");
const ResponseFactory = require("../../common/api/response/dynamic.response.factory");

const APP_ROLES = require("../../../config/app.role").APP_ROLES;

const logger = require("../../../shared/logger/logger.module")(
  "shop.controller.js"
);

exports.create = async (req, res) => {
  try {
    if (
      !commonFunctions.validateRequestBody(
        req.body,
        ShopApiRequest.CREATE_API,
        false,
        res
      )
    )
      return;

    if (!(req.body.admin && req.body.admin.userName)) {
      res
        .status(400)
        .send(
          ResponseFactory.getErrorResponse({ message: "user name required" })
        );
      return;
    }

    const AdminList = await EntityManager.getResultByQuery(
      Admin.NamedQuery.getAdminByUserName(req.body.admin.userName)
    );

    if (AdminList.length > 0) {
      logger.info(
        "User Name already exist. username: " + req.body.admin.userName
      );
      res.status(400).send(
        ResponseFactory.getErrorResponse({
          message: "User Name already exist",
        })
      );
      return;
    }

    let shop = new Shop(req.body);
    shop.createdDate = new Date();
    shop.status = mainConfig.SYSTEM_STATUS.PENDING;

    let admin = new Admin(req.body);
    admin.userName = req.body.admin.userName;
    admin.password = req.body.admin.password;
    admin.fullName = req.body.admin.fullName;
    admin.roleId = APP_ROLES[1].ID;

    const txn = EntityManager.getTransaction();

    shop = await txn.persist(Shop, shop);

    admin.shopId = shop.id;
    admin.createdDate = new Date();

    await txn.persist(Admin, admin);
    await txn.commit();

    logger.info("Shop Created. Id: " + shop.id);

    res.send(
      ResponseFactory.getSuccessResponse({
        data: ShopApiResponse.ShopCreationResponse(shop),
        message: "Shop Created",
      })
    );
  } catch (e) {
    logger.error(e || null);
    res
      .status(500)
      .send(
        ResponseFactory.getErrorResponse({ message: "Internal Server Error" })
      );
  }
};

exports.update = async (req, res) => {
  try {
    // Validate the Request
    if (
      !commonFunctions.validateRequestBody(
        req.body,
        ShopApiRequest.UPDATE_API,
        true,
        res
      )
    )
      return;

    let shop = await EntityManager.findOne(Shop, req.body.id);

    if (shop === null) {
      res.status(400).send(
        ResponseFactory.getErrorResponse({
          message: "Shop not exist with id: " + req.body.id,
        })
      );
      return;
    }

    if (!commonFunctions.isValidToProcess(req, res, shop.id)) return;

    shop.name = req.body.name;
    shop.email = req.body.email;
    shop.description = req.body.description;
    shop.image = req.body.image;
    shop.telephone = req.body.telephone;
    shop.address = req.body.address;
    shop.city = req.body.city;
    shop.longitude = req.body.longitude;
    shop.latitude = req.body.latitude;

    const updateResponse = await EntityManager.updateOne(Shop, shop);

    if (!updateResponse) {
      logger.error("Shop Updating failed with id: " + req.body.id);
      res
        .status(400)
        .send(
          ResponseFactory.getErrorResponse({ message: "Internal Server Error" })
        );
      return;
    }

    logger.info("Shop Updated: Id: " + req.body.id);
    res.send(
      ResponseFactory.getSuccessResponse({
        id: req.body.id,
        message: "Successfully Updated!",
      })
    );
  } catch (e) {
    logger.error(e || null);
    res
      .status(500)
      .send(
        ResponseFactory.getErrorResponse({ message: "Internal Server Error" })
      );
  }
};

exports.updateStatus = async (req, res) => {
  try {
    // Validate the Request
    if (
      !commonFunctions.validateRequestBody(
        req.body,
        ApiRequest.STATUS_UPDATE_API,
        false,
        res
      )
    )
      return;

    if (!commonFunctions.isValidToProcess(req, res, req.body.shopId)) return;

    let shop = await EntityManager.findOne(Shop, req.body.primaryId);

    if (!shop) {
      res.status(400).send(
        ResponseFactory.getErrorResponse({
          message: "Shop not exist with id: " + req.body.id,
        })
      );
      return;
    }

    shop.status = req.body.status;

    const updateResponse = await EntityManager.updateOne(Shop, shop);

    if (!updateResponse) {
      logger.error("Shop updating failed with id : " + req.body.id);
      res.status(400).send(
        ResponseFactory.getErrorResponse({
          message: "Shop updating failed with id : " + req.body.id,
        })
      );
      return;
    }

    logger.info("Shop Status Updated: Id: " + req.body.primaryId);
    res.send(
      ResponseFactory.getSuccessResponse({
        id: req.body.primaryId,
        message: "Successfully Updated the shop status!",
      })
    );
  } catch (e) {
    logger.error(e || null);
    res
      .status(500)
      .send(
        ResponseFactory.getErrorResponse({ message: "Internal Server Error" })
      );
  }
};

exports.findOne = async (req, res) => {
  try {
    if (!commonFunctions.isValidToProcess(req, res, req.params.shopId)) return;

    const shop = await EntityManager.findOne(Shop, req.params.shopId);

    if (!shop) {
      res.status(204).send();
      return;
    }
    res.send(ResponseFactory.getSuccessResponse({ data: shop }));
  } catch (e) {
    logger.error(e || null);
    res
      .status(500)
      .send(
        ResponseFactory.getErrorResponse({ message: "Internal Server Error" })
      );
  }
};

exports.findAll = (req, res) => {
  try {
    let SELECT_SQL = `SELECT * FROM ${Shop.EntityName} `;
    let FILTER = ``;
    let COLUMN_MAP = [];

    searchTemplate.dynamicDataOnlySearch(
      SELECT_SQL,
      FILTER,
      COLUMN_MAP,
      null,
      new SearchRequest({}),
      res
    );
  } catch (e) {
    logger.error(e || null);
    res
      .status(500)
      .send(
        ResponseFactory.getErrorResponse({ message: "Internal Server Error" })
      );
  }
};

exports.findByCriteria = (req, res) => {
  try {
    // Validate the Request
    // if (!commonFunctions.requestValidator(req.body, SearchRequest.API, [], false, res))
    //     return;

    let SELECT_SQL = `SELECT * FROM ${Shop.EntityName} `;
    let COUNT_SQL = `SELECT COUNT(id) AS ct FROM ${Shop.EntityName} `;
    let FILTER = "";
    let COLUMN_MAP = {
      name: "name",
      email: "email",
      telephone: "telephone",
      city: "city",
    };

    let searchReq = new SearchRequest(req.body);

    searchTemplate.dynamicSearchWithCount(
      SELECT_SQL,
      COUNT_SQL,
      FILTER,
      COLUMN_MAP,
      null,
      searchReq,
      res
    );
    // searchTemplate.dynamicDataOnlySearch(SELECT_SQL, FILTER,COLUMN_MAP, searchReq, res);
  } catch (e) {
    logger.error(e || null);
    res
      .status(500)
      .send(
        ResponseFactory.getErrorResponse({ message: "Internal Server Error" })
      );
  }
};

exports.findByMap = (req, res) => {
  try {
    // Validate the Request
    // if (!commonFunctions.requestValidator(req.body, SearchRequest.API, [], false, res))
    //     return;

    let latitude = req.params.latitude;
    let longitude = req.params.longitude;
    let radius = req.params.radius;

    let productNameCondition = '';

    if (req.query.productName) {
      productNameCondition = `AND (SELECT count(id) AS ct from ${Product.EntityName} where shopId=${Shop.EntityName}.id AND name LIKE "%${req.query.productName}%") > 0`;
    }

    let SELECT_SQL = `SELECT id ,name ,email ,telephone ,city ,latitude ,longitude ,status, 
    ( 6371 * acos( cos( radians(${latitude}) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(${longitude}) ) + sin( radians(${latitude}) ) * sin(radians(latitude)) ) ) AS distance 
    FROM ${Shop.EntityName}`;
    let FILTER = `HAVING distance < ${radius} AND status = ${mainConfig.SYSTEM_STATUS.APPROVED}  ${productNameCondition}`;
    let COLUMN_MAP = {
      name: "name",
      email: "email",
      telephone: "telephone",
      productName: "productName",
    };

    let searchReq = new SearchRequest(req.body);

    let outputMapper = {
      id: "id",
      name: "name",
      email: "email",
      telephone: "telephone",
      city: "city",
      latitude: "latitude",
      longitude: "longitude",
      distance: "distance",
    };

    searchTemplate.dynamicDataOnlySearch(
      SELECT_SQL,
      FILTER,
      COLUMN_MAP,
      outputMapper,
      searchReq,
      res
    );
  } catch (e) {
    logger.error(e || null);
    res
      .status(500)
      .send(
        ResponseFactory.getErrorResponse({ message: "Internal Server Error" })
      );
  }
};
