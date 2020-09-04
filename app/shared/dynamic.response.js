const Status = require("../config/main.config").STATUS;

DynamicResponse = (response) => {
    this.status = response.status;
};

DynamicResponse.error = (response) => {
    this.status = Status.RESPONSE_ERROR;
    this.message = response.message;
    return this;
};

DynamicResponse.success = (response) => {
    this.status = Status.RESPONSE_SUCCESS;
    this.message = response.message;
    this.id = response.id;
    this.data = response.data;
    return this;
};

DynamicResponse.searchResponse = (response) => {
    this.status = Status.RESPONSE_SUCCESS;
    this.offset = response.offset;
    this.limit = response.limit;
    this.recordCount = response.recordCount;
    this.data = response.data;
    return this;
};

module.exports = DynamicResponse;