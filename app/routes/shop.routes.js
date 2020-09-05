const shops = require("../controllers/shop.controller");
const express = require('express');
const commonFunctions = require("../shared/common.functions");
const appFunctions = require("../../app.functions").APP_FUNCTIONS;
const router = express.Router();

router.get('/', commonFunctions.authValidator(appFunctions.FIND_SHOP_BY_CRITERIA.ID), shops.findAll);

router.get('/:shopId', commonFunctions.authValidator(appFunctions.VIEW_SHOP_DETAILS.ID), shops.findOne);

router.post('/', commonFunctions.authValidator(appFunctions.CREATE_SHOP.ID), shops.create);

router.put('/', commonFunctions.authValidator(appFunctions.UPDATE_SHOP.ID), shops.update);

router.post('/findByCriteria',commonFunctions.authValidator(appFunctions.FIND_SHOP_BY_CRITERIA.ID), shops.findByCriteria);

module.exports = router;
