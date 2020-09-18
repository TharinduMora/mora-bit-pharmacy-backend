ApiRequest = {
    Admin : {
        CREATE_API: {
            userName: "",
            password: "",
            fullName: "",
            email: "",
            telephone: "",
            address: "",
            city: "",
            roleId: 0,
            adminType: 0
        },
        UPDATE_API: {
            id: 0,
            fullName: "",
            telephone: "",
            address: "",
            city: "",
            roleId: 0,
            adminType: 0
        },
        LOGIN_REQUEST: {
            userName: "",
            password: ""
        },
    },
    COMMON : {}
};

module.exports =ApiRequest;