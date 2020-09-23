ShopApiRequest = {
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
        admin: {
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
};

module.exports = ShopApiRequest;
