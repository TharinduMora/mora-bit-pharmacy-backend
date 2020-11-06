// constructor
const Product = function (product) {
    this.id = product.id || 0;
    this.shopId = product.shopId || 0;
    this.status = product.status || 0;
    this.stockAvailable = product.stockAvailable || 0;
    this.name = product.name || null;
    this.description = product.description || null;
    this.image = product.image || null;
};

Product.EntityName = "product";
Product.PrimaryKey = "id";
Product.updateRestrictedColumns = ["id", "shopId"];

module.exports = Product;
