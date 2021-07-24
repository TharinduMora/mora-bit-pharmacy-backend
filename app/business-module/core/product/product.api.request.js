ProductApiRequest = {
    CREATE_API: {
        BODY: {
            shopId: 0,
            stockAvailable: false,
            name: "",
            unit:"",
            description: "",
            image: "",
            price:0,
            availableQuantity:0
        },
        MandatoryColumns: ["shopId", "name","unit"]
    },
    UPDATE_API: {
        BODY: {
            id: 0,
            shopId: 0,
            stockAvailable: 0,
            name: "",
            unit:"",
            description: "",
            image: "",
            price:0,
            availableQuantity:0
        },
        MandatoryColumns: ["id"]
    },
};

module.exports = ProductApiRequest;
