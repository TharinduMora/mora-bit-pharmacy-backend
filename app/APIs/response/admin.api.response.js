class AdminApiResponse {

    AdminLoginResponse(admin) {
        this.userName = admin.userName;
        this.fullName = admin.fullName;
        this.email = admin.email;
        this.telephone = admin.telephone;
        this.address = admin.address;
        this.city = admin.city;
        this.sessionId = admin.sessionId;
        this.roleId = admin.roleId;
        this.adminType = admin.adminType;
        this.status = admin.status;
        return this;
    };

    AdminCreationResponse(admin) {
        this.id = admin.id;
        this.userName = admin.userName;
        this.fullName = admin.fullName;
        this.email = admin.email;
        this.telephone = admin.telephone;
        this.address = admin.address;
        this.city = admin.city;
        this.roleId = admin.roleId;
        this.adminType = admin.adminType;
        this.status = admin.status;
        return this;
    };
}

module.exports = new AdminApiResponse();