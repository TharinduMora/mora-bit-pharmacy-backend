const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");

const fileUploader = require("./app/shared/file-upload/file.upload");
const appConfig = require("./app.config");
const ResponseFactory = require("./app/APIs/response/dynamic.response.factory");

const app = express();

fs.mkdir(path.join(__dirname, appConfig.UPLOAD_FILES.DIR_NAME), {recursive: true}, function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log("'Uploads' directory successfully created.")
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
console.log(require("./app/shared/common.functions").getSessionId());

app.use("/shop", require("./app/routes/shop.routes.js"));
app.use("/admin", require("./app/routes/admin.routes.js"));

app.listen(appConfig.SERVER.PORT, () => {
    console.log(`Server is running on port ${appConfig.SERVER.PORT}.`);
});
