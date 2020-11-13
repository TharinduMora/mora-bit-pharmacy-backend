const myAccountCtl = require("./my.account.controller");
const express = require('express');
const commonFunctions = require("../../common/common.functions");
const appFunctions = require("../../../config/app.functions").APP_FUNCTIONS;
const router = express.Router();

router.get('/admin/:adminId', commonFunctions.authValidator(appFunctions.DEFAULT.ID), myAccountCtl.adminFind);

router.put('/admin', commonFunctions.authValidator(appFunctions.DEFAULT.ID), myAccountCtl.adminUpdate);

router.get('/shop/:shopId', commonFunctions.authValidator(appFunctions.DEFAULT.ID), myAccountCtl.shopFind);

router.put('/shop', commonFunctions.authValidator(appFunctions.DEFAULT.ID), myAccountCtl.shopUpdate);

module.exports = router;
