var express = require("express");
var cors = require("cors");

var app = express();

// To allow cross-origin requests
app.use(cors());

app.use(express.json());

module.exports = app;
