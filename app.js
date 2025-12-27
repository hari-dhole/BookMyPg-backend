var express = require("express");
var cors = require("cors");

var app = express();

// To allow cross-origin requests
app.use(cors());

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}...`));

module.exports = app;
