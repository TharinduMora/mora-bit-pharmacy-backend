const poolConnection = require("../database/db.pool");
const commonFunctions = require("../shared/common.functions");

// constructor
const Shop = function (shop) {
    this.name = shop.name;
    this.email = shop.email;
    this.telephone = shop.telephone;
    this.address = shop.address;
    this.city = shop.city;
};

Shop.updateDisableColumns = ["id", "email"];

Shop.create = (newShop, result) => {
    console.log(newShop);
    poolConnection.query("INSERT INTO shops SET ?", newShop, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created customer: ", {id: res.insertId, ...newShop});
        result(null, {id: res.insertId, ...newShop});
    });
};

Shop.updateById = (id, shop, result) => {
    const queryAndValueGenerator = commonFunctions.queryAndValueGenerator(shop, Shop.updateDisableColumns);
    const sqlQuery = "UPDATE shops SET " + queryAndValueGenerator.query + " WHERE id = ?";
    const values = [...queryAndValueGenerator.values, id]

    poolConnection.query(
        sqlQuery, values, (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(err, null);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Customer with the id
                result({kind: "not_found"}, null);
                return;
            }

            console.log("updated shop: ", {id: id});
            result(null, {id: id});
        }
    );
};

Shop.findById = (shopId, result) => {
    poolConnection.query(`SELECT * FROM shops WHERE id = ${shopId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found customer: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Customer with the id
        result({kind: "not_found"}, null);
    });
};

Shop.getAll = (result) => {
    let SELECT_SQL = "SELECT * FROM shops LIMIT 0,3";
    let COUNT_SQL = "SELECT COUNT(id) AS ct FROM shops";
    poolConnection.query(SELECT_SQL, (err, res) => {
        if (err) {
            result(null, err);
            return;
        } else {
            poolConnection.query(COUNT_SQL, (err2, res2) => {
                if (err2) {
                    result(null, err2);
                    return;
                }
                if (res2.length) {
                    result(null, {data: res, ct: res2[0].ct});
                }
                result({kind: "not_found"}, null);
            });
        }

    });
};


module.exports = Shop;