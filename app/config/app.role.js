const AppFunctions = require("./app.functions").APP_FUNCTIONS;

exports.APP_ROLES = {
    ROLE_1: {
        ID: 1,
        NAME: "Super Role",
        FUNCTIONS: [
            AppFunctions.FIND_SHOP_BY_CRITERIA.ID,
            AppFunctions.VIEW_SHOP_DETAILS.ID,
            AppFunctions.CREATE_SHOP.ID,
            AppFunctions.UPDATE_SHOP.ID
        ]
    }
};