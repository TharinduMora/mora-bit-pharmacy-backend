const DbTransactionChain = require("./app/shared/database/db.operations.chain");
const queryGen = require("./app/shared/database/db.query.gen.function");
const Shop = require("./app/models/shop.model");
const Admin = require("./app/models/admin.model");

const DBTransactionConnectionSingleton = require("./app/shared/database/db.transaction.connection.singleton");
const transactionConnection = DBTransactionConnectionSingleton.getTransactionConnection();


asd = async ()=>{
    const chain = transactionConnection.chain();
    const shop = new Shop({
        name: "test1",
        email: "test1",
        description: "test1",
        image: "test1",
        telephone: "test1",
        address: "test1",
        city: "test1",
        longitude: 0.0,
        latitude: 0.0
    });

    const admin = new Admin({
        userName: "d1",
        password: "123456",
        fullName: "Tharindu Jayasinghe",
        email: "tharin@gmail.com",
        telephone: "+94713451233",
        address: "Kalu",
        city: "Badulla",
        roleId: 1,
        shopId:1
    });
    const createShop = queryGen.getInsertQuery(1,Shop.EntityName,shop);
    // const shopResponse = await em.setQuery(createShop,false);
    const shopResponse = await DbTransactionChain.setQueryAndGetResult(createShop);

    admin.shopId = shopResponse.insertId;
    const createAdmin = queryGen.getInsertQuery(2,Admin.EntityName,admin);
    // const adminResponse = await em.setQuery(createAdmin,true);
    const adminResponse = await DbTransactionChain.setQueryAndGetResult(createAdmin);

    const queryResponse = await DbTransactionChain.commitQueries();
    console.log(queryResponse);


    // if(adminResponse){
    //     console.log("done");
    // }

    // chain.
    // on('commit', function(){
    //     console.log('number commit');
    // }).
    // on('rollback', function(err){
    //     console.log('rollback');
    //     console.log(err);
    // });
    //
    // chain.query(createShop.query,createShop.value).on('result', function(result){
    //     console.log(result.insertId);
    // }).
    // query(createAdmin.query,createAdmin.value).on('result', function(result){
    //     chain.commit();
    // }).
    // autoCommit(false);
};

asd().then(r => {
    // console.log(r);
});


// function aaa1(){
//     console.log("Started");
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             // resolve(true);
//             reject("kela");
//         }, 2000);
//     });
// };
//
// async function asd() {
//     const aaa = await aaa1().catch(()=>{});
//     console.log(aaa);
// }
//
// function asd2(){
//     console.log("func 2");
// }
//
// asd().then();
// asd2();