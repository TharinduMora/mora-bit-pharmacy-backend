const shops = require("../shop/shop.controller");
const express = require('express');
const router = express.Router();

router.get('/shop/:shopId', shops.clientFindOne);

router.post('/findByMap/:latitude/:longitude/:radius', shops.findByMap);

module.exports = router;
