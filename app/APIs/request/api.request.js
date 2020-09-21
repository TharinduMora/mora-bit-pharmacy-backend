ApiRequest = {
    Admin : {
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
        },
    },
    Shop : {
        CREATE_API: {
            name: "",
            email: "",
            description: "",
            image: "",
            telephone: "",
            address: "",
            city: "",
            longitude: 0.0,
            latitude: 0.0,
            admin : {
                userName: "",
                password: "",
                fullName: ""
            }
        },
        UPDATE_API: {
            id: 0,
            name: "",
            email: "",
            description: "",
            image: "",
            telephone: "",
            address: "",
            city: "",
            longitude: 0.0,
            latitude: 0.0
        }
    },
    COMMON : {}
};

module.exports =ApiRequest;
