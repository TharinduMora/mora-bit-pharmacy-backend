const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const fs = require("fs");

const appConfig = require("./app.config");
const fileUploader = require("./app/shared/file-upload/file.upload");
const dynamicResponse = require("./app/shared/dynamic.response");

const app = express();

fs.mkdir(path.join(__dirname,appConfig.UPLOAD_FILES.DIR_NAME), { recursive: true }, function(err) {
    if (err) {
        console.log(err)
    } else {
        console.log("Uploads directory successfully created.")
    }
});

app.use(appConfig.UPLOAD_FILES.DIR_PATH,express.static(path.join(__dirname,appConfig.UPLOAD_FILES.DIR_NAME)));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({message: "Welcome to smart pharmacy application."});
});

app.use("/shop",require("./app/routes/shop.routes.js"));

app.post('/upload', fileUploader.upload.single('image'), (req, res, next) => {
    try {
        return res.status(200).send(dynamicResponse.uploadSuccess({ message: 'File uploaded successfully', url:req.file.path || null}));
    } catch (error) {
        return res.status(500).send(dynamicResponse.error({ message: error || 'File uploaded failed'}));
    }
});

app.listen(appConfig.SERVER.PORT, () => {
    console.log(`Server is running on port ${appConfig.SERVER.PORT}.`);
});
