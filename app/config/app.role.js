const AppFunctions = require("./app.functions").APP_FUNCTIONS;
const MainConfig = require("./main.config");

exports.APP_ROLES = {
    ROLE_1: {
        ID: 1,
        NAME: "Super Admin",
        TYPE: MainConfig.ADMIN_TYPES.SYSTEM_ADMIN,
        FUNCTIONS: [
            // Admin Functions
            AppFunctions.FIND_ADMIN_BY_CRITERIA.ID,
            AppFunctions.VIEW_ADMIN_DETAILS.ID,
            AppFunctions.CREATE_ADMIN.ID,
            AppFunctions.UPDATE_ADMIN.ID,
            AppFunctions.UPDATE_ADMIN_STATUS.ID,
            // Shop Functions
            AppFunctions.FIND_SHOP_BY_CRITERIA.ID,
            AppFunctions.VIEW_SHOP_DETAILS.ID,
            AppFunctions.CREATE_SHOP.ID,
        ]
    },
    ROLE_2: {
        ID: 2,
        NAME: "Shop Admin",
        TYPE: MainConfig.ADMIN_TYPES.SHOP_ADMIN,
        FUNCTIONS: [
            AppFunctions.VIEW_SHOP_DETAILS.ID,
            AppFunctions.UPDATE_SHOP.ID,
        ]
    }
};
