const EntityManager = require("../../../shared/database/mysql/api/entity.manager");
const ResponseFactory = require("../../common/api/response/dynamic.response.factory");
const MyAccountApiResponse = require("./my.account.api.response");
const Admin = require("../../models/admin.model");
const Shop = require("../../models/shop.model");
const commonFunctions = require("../../common/common.functions");
const sessionStore = require("../../common/session.store");
const MyAccountApiRequest = require("./my.account.api.request");
const logger = require("../../../shared/logger/logger.module")("my.account.controller.js");

exports.adminFind = async (req, res) => {

    try {
        if (parseInt(req.params.adminId) !== parseInt(req.admin.id)) {
            res.status(401).send(ResponseFactory.getErrorResponse({message: 'Unauthorized User'}));
        }

        const admin = await EntityManager.findOne(Admin, req.params.adminId);

        if (admin === null) {
            res.status(204).send();
            return;
        }
        res.send(ResponseFactory.getSuccessResponse({data: MyAccountApiResponse.AdminDetailsResponse(admin)}));
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: "Internal Server Error"}));
    }
};

exports.adminUpdate = async (req, res) => {

    try {
        // Validate the Request and reformat to api format
        if (!commonFunctions.validateRequestBody(req.body, MyAccountApiRequest.UPDATE_API, false, res))
            return;

        if (req.admin.id !== req.body.id) {
            res.status(401).send(ResponseFactory.getErrorResponse({message: 'Invalidate User to current action.'}));
            return;
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

exports.changePassword = async (req, res) => {

    try {
        // Validate the Request and reformat to api format
        if (!commonFunctions.validateRequestBody(req.body, MyAccountApiRequest.CHANGE_PASSWORD_API, false, res))
            return;

        if (req.admin.id !== req.body.id) {
            res.status(401).send(ResponseFactory.getErrorResponse({message: 'Invalidate User to current action.'}));
            return ;
        }

        let admin = await EntityManager.findOne(Admin, req.body.id);

        if (admin === null) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Admin not exist with id: " + req.admin.id}));
            return;
        }

        if(admin.password !== req.body.currentPassword){
            res.status(400).send(ResponseFactory.getErrorResponse({message: 'Invalid Password'}));
            return ;
        }


        if (!commonFunctions.isValidToProcess(req, res, admin.shopId))
            return;

        admin.password = req.body.newPassword;

        console.log(admin);

        const updateResponse = await EntityManager.updateOne(Admin, admin);

        if (updateResponse === null) {
            res.status(500).send(ResponseFactory.getErrorResponse({id: req.body.id, message: "Admin Not found!"}));
            return;
        }
        sessionStore.removeAdminSession(req.admin.sessionId);
        logger.info('Admin Password Changed: Id: ' + req.body.id);
        res.send(ResponseFactory.getSuccessResponse({id: req.body.id, message: "Password Changed!"}));
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: "Internal Server Error"}));
    }
};

exports.shopFind = async (req, res) => {

    try {
        if (parseInt(req.params.shopId) !== parseInt(req.admin.shopId)) {
            res.status(401).send(ResponseFactory.getErrorResponse({message: 'Unauthorized User'}));
            return;
        }

        const shop = await EntityManager.findOne(Shop, req.params.shopId);

        if (shop === null) {
            res.status(204).send();
            return;
        }
        res.send(ResponseFactory.getSuccessResponse({data: MyAccountApiResponse.ShopDetailsResponse(shop)}));
    } catch (e) {
        logger.error(e);
        res.status(500).send(ResponseFactory.getErrorResponse({message: "Internal Server Error"}));
    }
};

exports.shopUpdate = async (req, res) => {

    try {
        // Validate the Request
        if (!commonFunctions.validateRequestBody(req.body, MyAccountApiRequest.UPDATE_SHOP_API, true, res))
            return;

        if (req.admin.shopId !== req.body.id) {
            res.status(401).send(ResponseFactory.getErrorResponse({message: 'Invalidate User to current action.'}));
            return;
        }

        let shop = await EntityManager.findOne(Shop, req.body.id);

        if (shop === null) {
            res.status(400).send(ResponseFactory.getErrorResponse({message: "Shop not exist with id: " + req.body.id}));
            return;
        }

        if (!commonFunctions.isValidToProcess(req, res, shop.id))
            return;

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
            logger.error('Shop Updating failed with id: ' + req.body.id);
            res.status(400).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
            return;
        }

        logger.info('Shop Updated: Id: ' + req.body.id);
        res.send(ResponseFactory.getSuccessResponse({id: req.body.id, message: "Successfully Updated!"}));
    } catch (e) {
        logger.error(e || null);
        res.status(500).send(ResponseFactory.getErrorResponse({message: 'Internal Server Error'}));
    }
};
