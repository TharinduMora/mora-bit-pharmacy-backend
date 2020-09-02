const express = require("express");
const bodyParser = require("body-parser");
const appConfig = require("./app.config");

const app = express();

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

// simple route
app.get("/", (req, res) => {
    res.json({message: "Welcome to smart pharmacy application."});
});

app.use("/shop",require("./app/routes/shop.routes.js"));

// require("./app/routes/customer.routes.js")(app);
// require("./app/routes/shop.routes.js")(app);

const PORT = appConfig.SERVER.PORT;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
