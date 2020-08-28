module.exports = app => {

    const basePath = "/shop";
    const shops = require("../controllers/shop.controller");

    // Create a new Customer
    app.post(basePath, shops.create);

    // // Retrieve all Customers
    app.get(basePath, shops.findAll);
    //
    // // Retrieve a single Customer with customerId
    // app.get(basePath + "/:customerId", customers.findOne);
    //
    // // Update a Customer with customerId
    app.put(basePath + "/:shopId", shops.update);
    //
    // // Delete a Customer with customerId
    // app.delete(basePath + "/:customerId", customers.delete);
    //
    // // Create a new Customer
    // app.delete("/shop", customers.deleteAll);
};
