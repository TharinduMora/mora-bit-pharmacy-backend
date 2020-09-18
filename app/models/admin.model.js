// constructor
const Admin = function (admin) {
    this.id = admin.id || 0;
    this.userName = admin.userName || null;
    this.password = admin.password || null;
    this.fullName = admin.fullName || null;
    this.email = admin.email || null;
    this.telephone = admin.telephone || null;
    this.address = admin.address || null;
    this.city = admin.city || null;
    this.sessionId = admin.sessionId || null;
    this.roleId = admin.roleId || 0;
    this.adminType = admin.adminType || 0;
    this.status = admin.status || 0;
};

Admin.EntityName = "admin";

Admin.NamedQuery = {
    getAdminByUserName(userName) {
        return `SELECT * FROM  ${Admin.EntityName} WHERE userName = '${userName}'`
    },
    getAdminBySessionId(sessionId) {
        return `SELECT * FROM  ${Admin.EntityName} WHERE sessionId = '${sessionId}'`
    },
    getAdminByUserNameAndPassword(userName, password) {
        return `SELECT * FROM  ${Admin.EntityName} WHERE userName = '${userName}' AND password = '${password}'`
    }
};

Admin.creationMandatoryColumns = ["userName", "password", "email", "roleId"];
Admin.updateMandatoryColumns = ["id"];
Admin.updateRestrictedColumns = ["id", "email", "userName", "password", "email"];

module.exports = Admin;