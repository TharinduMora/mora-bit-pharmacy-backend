const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const cors = require('cors');

const fileUploader = require("./app/shared/file-upload/file.upload");
const appConfig = require("./app/config/app.config");
const ResponseFactory = require("./app/business-module/common/api/response/dynamic.response.factory");
const logger = require('./app/shared/logger/logger.module')("server.js");

const app = express();

app.use(cors());

fs.mkdir(path.join(__dirname, appConfig.UPLOAD_FILES.DIR_NAME), {recursive: true}, function (err) {
    if (err) {
        logger.error(err);
    } else {
        logger.info("'Uploads' directory successfully created.");
    }
});

app.use(appConfig.UPLOAD_FILES.DIR_PATH, express.static(path.join(__dirname, appConfig.UPLOAD_FILES.DIR_NAME)));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({message: "Welcome to smart pharmacy application."});
});

app.post('/upload', fileUploader.upload.single('image'), (req, res, next) => {
    try {
        const filePath = appConfig.UPLOAD_FILES.DIR_NAME + '/' + req.file.filename;
        return res.status(200).send(ResponseFactory.getUploadSuccessResponse({
            message: 'File uploaded successfully',
            url: filePath || null
        }));
    } catch (error) {
        return res.status(500).send(ResponseFactory.getErrorResponse({message: error || 'File uploaded failed'}));
    }
});

app.use("/", (req, res, next) => {
    if(req.url !== "/undefined")
        logger.http("[" + req.method + "] " + req.url);
    // JSON.stringify(req.body)
    next();
});

app.use("/shop", require("./app/business-module/core/shop/shop.routes.js"));
app.use("/admin", require("./app/business-module/core/admin/admin.routes.js"));
app.use("/product", require("./app/business-module/core/product/product.routes"));
app.use("/my-account", require("./app/business-module/core/my-account/my.account.routes"));
app.use("/client", require("./app/business-module/core/client/client.routes"));

app.listen(appConfig.SERVER.PORT, () => {
    logger.info(`${appConfig.APP_NAME} started on port ${appConfig.SERVER.PORT}`);
});
