MyAccountApiRequest = {
    UPDATE_API: {
        BODY: {
            id: 0,
            shopId: 0,
            roleId: 0,
            fullName: "",
            telephone: "",
            address: "",
            city: ""
        },
        MandatoryColumns: ["id"]
    },
    UPDATE_SHOP_API: {
        BODY: {
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
        },
        MandatoryColumns: ["id"]
    }
};

module.exports = AdminApiRequest;
