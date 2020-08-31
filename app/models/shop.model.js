// constructor
const Shop = function (shop) {
    this.name = shop.name;
    this.email = shop.email;
    this.telephone = shop.telephone;
    this.address = shop.address;
    this.city = shop.city;
};

Shop.EntityName = "shops";

Shop.CREATE_API = {
    name: "",
    email: "",
    telephone: "",
    address: "",
    city: ""
};

Shop.UPDATE_API = {
    id: 0,
    name: "",
    telephone: "",
    address: "",
    city: ""
};

Shop.creationMandatoryColumns = ["email", "telephone"];
Shop.updateMandatoryColumns = ["id"];
Shop.updateRestrictedColumns = ["id", "email"];

module.exports = Shop;