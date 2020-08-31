module.exports = app => {

    const basePath = "/shop";
    const shops = require("../controllers/shop.controller");

    app.post(basePath, shops.create);
    app.put(basePath, shops.update);
    app.get(basePath, shops.findAll);
    app.get(basePath + "/:shopId", shops.findOne);
};
