const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");
const cors = require('cors');

const fileUploader = require("./app/core/shared/file-upload/file.upload");
const appConfig = require("./app/config/app.config");
const ResponseFactory = require("./app/core/shared/API/response/dynamic.response.factory");
const logger = require('./app/core/shared/logger/logger.module')("server.js");

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

// app.use("/shop", require("./app/routes/shop.routes.js"));
// app.use("/admin", require("./app/routes/admin.routes.js"));
// app.use("/requests", require("./app/routes/api.request.routes"));
// app.use("/masterData", require("./app/routes/master.data.routes"));
// app.use("/product", require("./app/routes/product.routes"));

app.use("/shop", require("./app/core/common/shop/shop.routes.js"));
app.use("/admin", require("./app/core/common/admin/admin.routes.js"));
app.use("/masterData", require("./app/core/common/masterdata/master.data.routes"));
app.use("/product", require("./app/core/common/product/product.routes"));

app.listen(appConfig.SERVER.PORT, () => {
    logger.info(`${appConfig.APP_NAME} started on port ${appConfig.SERVER.PORT}`);
});
