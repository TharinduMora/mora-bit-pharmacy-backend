const product = require("./product.controller");
const express = require('express');
const commonFunctions = require("../../shared/common.functions");
const appFunctions = require("../../../config/app.functions").APP_FUNCTIONS;
const router = express.Router();

router.post('/',commonFunctions.authValidator(appFunctions.CREATE_PRODUCT.ID), product.create);

module.exports = router;
