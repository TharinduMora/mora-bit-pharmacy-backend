const poolConnection = require("../database/db.pool");
const commonFunctions = require("../shared/common.functions");
const dbFunctions = require("../shared/db.operations");

// constructor
const Shop = function (shop) {
    this.name = shop.name;
    this.email = shop.email;
    this.telephone = shop.telephone;
    this.address = shop.address;
    this.city = shop.city;
};

Shop.updateDisableColumns = ["id", "email"];
Shop.reqiredColumns = ["email", "telephone"];

// Shop.create = (newShop, result) => {
//     console.log(newShop);
//     poolConnection.query("INSERT INTO shops SET ?", newShop, (err, res) => {
//         if (err) {
//             console.log("error: ", err);
//             result(err, null);
//             return;
//         }
//
//         console.log("created customer: ", {id: res.insertId, ...newShop});
//         result(null, {id: res.insertId, ...newShop});
//     });
// };
//
// Shop.updateById = (id, shop, result) => {
//
//     const updateCondition = "id = " + id;
//     dbFunctions.updateEntity(shop, "shops", updateCondition, id, Shop.updateDisableColumns, (err, res) => {
//         if (err) {
//             result(err, null);
//             return;
//         }
//         result(null, res);
//     });
// };
//
// Shop.findById = (shopId, result) => {
//     dbFunctions.findOne("shops", "id", shopId, (err, res) => {
//         if (err)
//             result(err);
//         else
//             result(res);
//     });
// };
//
// Shop.getAll = (result) => {
//     let SELECT_SQL = "SELECT * FROM shops LIMIT 0,3 ";
//     let COUNT_SQL = "SELECT COUNT(id) AS ct FROM shops ";
//     poolConnection.query(SELECT_SQL, (err, res) => {
//         if (err) {
//             result(null, err);
//             return;
//         } else {
//             poolConnection.query(COUNT_SQL, (err2, res2) => {
//                 if (err2) {
//                     result(null, err2);
//                     return;
//                 }
//                 if (res2.length) {
//                     result(null, {data: res, ct: res2[0].ct});
//                     return;
//                 }
//                 result({kind: "not_found"}, null);
//             });
//         }
//     });
// };

module.exports = Shop;