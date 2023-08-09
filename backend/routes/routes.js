const route = require("express").Router();

// All routes for differents files and tables come here
route.use("/api/user", require("./user.js"));
route.use("/api/auth", require("./auth.js"));
route.use("/api/data", require("./data.js"));

module.exports = route;