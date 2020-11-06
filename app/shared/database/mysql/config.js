module.exports = {
    CONFIG: {
        CONNECTION_LIMIT: 100,
        HOST: "localhost",
        USER: "root",
        PASSWORD: "password",
        DB: "pharmacy-db"
    },
    STATUS: {
        SUCCESS: 1,
        SQL_ERROR: 2,
        NOT_FOUND_ERR: 3
    },
    mysqlOutput(data) {
        this.status = data.status;
        this.data = data.data;
        return data;
    },
    getLogger(){
        return require("../../logger/logger.module");
    }
}
