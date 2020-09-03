const AppFunctions = require("./app.functions").APP_FUNCTIONS;

exports.APP_ROLES = {
    ROLE_1: {
        ID: 1,
        NAME: "Super Role",
        FUNCTIONS: [
            AppFunctions.FIND_SHOP_BY_CRITERIA,
            AppFunctions.VIEW_SHOP_DETAILS,
            AppFunctions.CREATE_SHOP,
            AppFunctions.UPDATE_SHOP
        ]
    }
};