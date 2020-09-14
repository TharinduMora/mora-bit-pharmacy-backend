// constructor
const Admin = function (admin) {
    this.userName = admin.userName || null;
    this.password = admin.password || null;
    this.fullName = admin.fullName || null;
    this.email = admin.email || null;
    this.telephone = admin.telephone || null;
    this.address = admin.address || null;
    this.city = admin.city || null;
    this.roleId = admin.roleId || 0;
    this.adminType = admin.adminType || 0;
    this.status = admin.status || 0;
};

Admin.EntityName = "admin";

Admin.CREATE_API = {
    userName: "",
    password: "",
    fullName: "",
    email: "",
    telephone: "",
    address: "",
    city: "",
    roleId: 0,
    adminType: 0
};

Admin.UPDATE_API = {
    id: 0,
    fullName: "",
    telephone: "",
    address: "",
    city: "",
    roleId: 0,
    adminType: 0
};

Admin.NamedQuery = {
    getAdminByUserName(userName){
        return `SELECT * FROM  ${Admin.EntityName} WHERE userName = '${userName}'`
    }
}

Admin.creationMandatoryColumns = ["userName", "password", "email", "roleId"];
Admin.updateMandatoryColumns = ["id"];
Admin.updateRestrictedColumns = ["id", "email","userName", "password", "email"];

module.exports = Admin;