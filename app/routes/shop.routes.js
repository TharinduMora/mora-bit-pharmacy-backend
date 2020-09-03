const shops = require("../controllers/shop.controller");
const express = require('express');
const router = express.Router();
const commonFunctions = require("../shared/common.functions");

router.use(function (req, res, next) {
    console.log('Time:', Date.now());
    req.admin = {
        functions: [1, 2]
    };
    // res.send("Error");
    next()
});

router.get('/', function (req, res, next) {
    commonFunctions.authValidator(req, res, 3, next);
}, shops.findAll);
router.get('/:shopId', shops.findOne);
router.post('/', function (req, res, next) {
    commonFunctions.authValidator(req, res, 1, next);
}, shops.create);
router.put('/', shops.update);

//export this router to use in our index.js
module.exports = router;
