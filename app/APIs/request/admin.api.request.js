AdminApiRequest = {
    CREATE_API: {
        roleId: 0,
        shopId: 0,
        userName: "",
        password: "",
        fullName: "",
        email: "",
        telephone: "",
        address: "",
        city: "",
    },
    UPDATE_API: {
        id: 0,
        shopId: 0,
        roleId: 0,
        fullName: "",
        telephone: "",
        address: "",
        city: ""
    },
    LOGIN_REQUEST: {
        userName: "",
        password: ""
    }
};

module.exports = AdminApiRequest;
