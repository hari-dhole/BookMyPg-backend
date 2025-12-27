var express = require("express");
var cors = require("cors");
var apiRouter = require("./routes/api");
var indexRouter = require("./routes/index");

var app = express();

// To allow cross-origin requests
app.use(cors());

app.use(express.json());

// Route Prefixes
app.use("/", indexRouter);
app.use("/api/", apiRouter);

module.exports = app;
