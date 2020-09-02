const shops = require("../controllers/shop.controller");
const express = require('express');
const router = express.Router();

router.use(function (req, res, next) {
    console.log('Time:', Date.now())
    // res.send("Error");
    next()
})

router.get('/', shops.findAll);
router.get('/:shopId', shops.findOne);
router.post('/', shops.create);
router.put('/', shops.update);

//export this router to use in our index.js
module.exports = router;
