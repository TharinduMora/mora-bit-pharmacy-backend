const Admin = require("../models/admin.model");
const commonFunctions = require("../shared/common.functions");
const dbOperations = require("../shared/database/db.operations");
const searchTemplate = require("../shared/search/search.template");
const ResponseFactory = require("../shared/dynamic.response.factory");
const SearchRequest = require("../shared/search/SearchRequest");
const mainConfig = require("../../app/config/main.config")

exports.create = (req, res) => {
    if (!commonFunctions.requestValidator(req.body, Admin.CREATE_API, Admin.creationMandatoryColumns, false, res))
        return;

    function createNewAdmin(){
        // Create a Admin
        const admin = new Admin({
            userName: req.body.userName,
            password: req.body.password,
            fullName: req.body.fullName,
            email: req.body.email,
            telephone: req.body.telephone,
            address: req.body.address,
            city: req.body.city
        });

        admin.roleId = 1;
        admin.adminType = mainConfig.ADMIN_TYPES.SHOP_ADMIN;
        admin.status = mainConfig.SYSTEM_STATUS.CREATED;

        dbOperations.create(Admin.EntityName, admin, (err, data) => {
            if (err)
                res.status(500).send(ResponseFactory.getErrorResponse({message: err.message || "Some error occurred while creating the Admin."}));
            else
                res.send(ResponseFactory.getSuccessResponse({data: data, message: "Admin Created"}));
        });
    }

    dbOperations.findOne(Admin.EntityName,"userName",`${req.body.userName}`,(err,result)=>{
        if(result){
            res.status(400).send(ResponseFactory.getErrorResponse({message:'User Name already exist'}));
            return ;
        }
        if(err && err.kind === "not_found"){
            createNewAdmin();
        }else{
            res.status(500).send(ResponseFactory.getErrorResponse({message:'Internal Server Error'}));
        }
    })
};

exports.findOne = (req, res) => {
    dbOperations.findOne(Admin.EntityName, "id", req.params.adminId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
            } else {
                res.status(500).send(ResponseFactory.getErrorResponse({message: err.message || "Some error occurred while retrieving Admin with Id:" + req.params.AdminId}));
            }
        } else res.send(ResponseFactory.getSuccessResponse({data: data}));
    });
};

exports.update = (req, res) => {

    // Validate the Request
    if (!commonFunctions.requestValidator(req.body, Admin.UPDATE_API, Admin.updateMandatoryColumns, false, res))
        return;

    // Create Update Condition
    const updateCondition = ` id = ${req.body.id} `;

    let updatingAdmin = new Admin(req.body);

    dbOperations.updateEntity(new Admin(updatingAdmin), Admin.EntityName, updateCondition, req.body.id, Admin.updateRestrictedColumns, (err, data) => {///
        if (err) {
            if (err.kind === "not_found") {
                res.status(204).send();
            } else {
                res.status(500).send(ResponseFactory.getErrorResponse({message: err.message || "Admin Updating failed with Id:" + req.body.id}));
            }
        } else res.send(ResponseFactory.getSuccessResponse({id: req.body.id, message: "Successfully Updated!"}));
    });
};

exports.findAll = (req, res) => {

    let SELECT_SQL = `SELECT * FROM ${Admin.EntityName} `;
    let FILTER = ``;
    let COLUMN_MAP = [];

    searchTemplate.dynamicDataOnlySearch(SELECT_SQL, FILTER, COLUMN_MAP, new SearchRequest({}), res);
};

exports.findByCriteria = (req, res) => {

    // Validate the Request
    // if (!commonFunctions.requestValidator(req.body, SearchRequest.API, [], false, res))
    //     return;

    let SELECT_SQL = `SELECT * FROM ${Admin.EntityName} `;
    let COUNT_SQL = `SELECT COUNT(id) AS ct FROM ${Admin.EntityName} `;
    let FILTER = '';
    let COLUMN_MAP = {
        name: "name",
        email: "email",
        telephone: "telephone",
        city: "city"
    };

    let searchReq = new SearchRequest(req.body);

    searchTemplate.dynamicSearchWithCount(SELECT_SQL, COUNT_SQL, FILTER, COLUMN_MAP, searchReq, res);
    // searchTemplate.dynamicDataOnlySearch(SELECT_SQL, filter, searchReq, res);
};

exports.transTest = (req, res) => {

    let transactionalQueryList = [];

    const admin = new Admin({
        name: "Test",
        email: "Test Trans",
        telephone: "Test",
        address: "Test",
        city: "Test"
    });

    // passing queryId is must for getting result object
    const AdminUpdateQuery = dbOperations.getUpdateQuery(1, new Admin(req.body), Admin.EntityName, ` id = ${req.body.id} `, req.body.id, Admin.updateRestrictedColumns);
    const AdminInsertQuery = dbOperations.getInsertQuery(2, Admin.EntityName, admin);

    transactionalQueryList.push(AdminInsertQuery, AdminUpdateQuery);

    const resultMapKey = 'resMap_';

    dbOperations.runAsTransaction(transactionalQueryList, resultMapKey, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (result[resultMapKey + 2]) {
                let newAdmin = {...admin};
                newAdmin.id = result[1].insertId;
                res.send(newAdmin);
                return;
            }
            res.send("Success");
        }
    })
};
