ProductApiRequest = {
    CREATE_API: {
        BODY: {
            shopId: 0,
            stockAvailable: false,
            name: "",
            description: "",
            image: "",
            price:0
        },
        MandatoryColumns: ["shopId", "name"]
    },
    UPDATE_API: {
        BODY: {
            id: 0,
            shopId: 0,
            stockAvailable: 0,
            name: "",
            description: "",
            image: "",
            price:0
        },
        MandatoryColumns: ["id"]
    },
};

module.exports = ProductApiRequest;
