const mainConfig = require("../../config/main.config")

class DBResponseFactory {
    DataNotFound() {
        this.status = mainConfig.DB_RESPONSE_STATUS.DATA_NOT_FOUND;
        return this;
    };

    SQL_ERROR() {
        this.status = mainConfig.DB_RESPONSE_STATUS.SQL_ERROR;
        return this;
    };

    Success(data) {
        this.status = mainConfig.DB_RESPONSE_STATUS.SUCCESS;
        this.data = data;
        return this;
    };

    isDataNotFoundResponse(status){
        return status === mainConfig.DB_RESPONSE_STATUS.DATA_NOT_FOUND;

    }

    isSqlErrorResponse(status){
        return status === mainConfig.DB_RESPONSE_STATUS.SQL_ERROR;

    }

    isSuccessResponse(status){
        return status === mainConfig.DB_RESPONSE_STATUS.SUCCESS;

    }
}

module.exports = new DBResponseFactory();