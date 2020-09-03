const shops = require("../controllers/shop.controller");
const express = require('express');
const commonFunctions = require("../shared/common.functions");
const router = express.Router();

router.get('/', commonFunctions.authValidator(3), shops.findAll);

router.get('/:shopId', shops.findOne);

router.post('/', commonFunctions.authValidator(2), shops.create);

router.put('/', shops.update);

module.exports = router;
