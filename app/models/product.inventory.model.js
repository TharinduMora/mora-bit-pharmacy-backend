// constructor
const ProductInventory = function (productInventory) {
    this.productId = productInventory.productId || 0;
    this.shopId = productInventory.shopId || 0;
    this.status = productInventory.status || 0;
    this.availableQuantity = productInventory.availableQuantity || 0;
    this.price = productInventory.price || 0;
};

ProductInventory.EntityName = "product_inventory";
ProductInventory.PrimaryKey = "productId";
ProductInventory.updateRestrictedColumns = ["productId", "shopId"];

module.exports = ProductInventory;
