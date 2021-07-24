class ProductApiResponse {
  ProductCreationResponse(data) {
    this.id = data.id || 0;
    this.shopId = data.shopId || 0;
    this.status = data.status || 0;
    this.stockAvailable = data.stockAvailable || null;
    this.name = data.name || null;
    this.unit = data.unit || null;
    this.description = data.description || null;
    this.image = data.image || null;
    this.price = data.price || 0;
    return this;
  }
}

module.exports = new ProductApiResponse();
