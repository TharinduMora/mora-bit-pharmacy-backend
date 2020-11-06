ApiRequest = {
    STATUS_UPDATE_API: {
        BODY: {
            shopId:0,
            primaryId: 0,
            status: 0
        },
        MandatoryColumns: ["primaryId", "status","shopId"]
    },
};

module.exports = ApiRequest;
