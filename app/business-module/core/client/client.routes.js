const shops = require("../shop/shop.controller");
const product = require("../product/product.controller");
const express = require("express");
const router = express.Router();

router.get("/shop/:shopId", shops.clientFindOne);

router.post("/findByMap/:latitude/:longitude/:radius", shops.findByMap);

router.post("/product/findByCriteria", product.findByCriteriaClient);

module.exports = router;
