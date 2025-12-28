var express = require("express");
var locationRouter = require("./location");
var amenitiesRouter = require("./amenity");

var app = express();

app.use("/locations", locationRouter);
app.use("/amenities", amenitiesRouter);

module.exports = app;
