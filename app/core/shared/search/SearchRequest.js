const appConfig = require("../../../config/app.config");

const SearchRequest = function (req) {
    this.shopId = req.shopId || 0;
    this.offset = req.offset || 0;
    this.limit = req.limit || appConfig.PAGINATION.MAX_LIMIT;
    this.searchKeys = req.searchKeys || [];
    this.operators = req.operators || [];
    this.values = req.values || [];
};

SearchRequest.API = {
    shopId: 0,
    offset: 0,
    limit: 0,
    searchKeys: [],
    operators: [],
    values: []
};

module.exports = SearchRequest;
