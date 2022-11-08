// CommonJS Module
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
var cors = require("cors");

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

require("./database/databaseConnnection");

// app.use(
//   "/public/uploads/",
//   express.static(path.join(__dirname, "/public/uploads/"))
// );

app.listen(90, () => {
  console.log("Listening at port 90.");
});
