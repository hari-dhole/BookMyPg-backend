var express = require("express");
var locationRouter = require("./location");

var app = express();

app.use("/locations", locationRouter);

module.exports = app;
