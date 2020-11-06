const product = require("./product.controller");
const express = require('express');
const commonFunctions = require("../../common/common.functions");
const appFunctions = require("../../../config/app.functions").APP_FUNCTIONS;
const router = express.Router();

router.post('/',commonFunctions.authValidator(appFunctions.CREATE_PRODUCT.ID), product.create);
router.put('/', commonFunctions.authValidator(appFunctions.UPDATE_PRODUCT.ID), product.update);
router.put('/updateStatus', commonFunctions.authValidator(appFunctions.UPDATE_PRODUCT_STATUS.ID), product.updateStatus);
router.post('/findByCriteria', commonFunctions.authValidator(appFunctions.FIND_PRODUCT_BY_CRITERIA.ID), product.findByCriteria);

module.exports = router;
