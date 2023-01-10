// CommonJS Module
const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const path = require("path");
var cors = require("cors");

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

require("./database/databaseConnection");

app.use("/images", express.static(path.join(__dirname, "/images")));
app.use("/files", express.static(path.join(__dirname, "/files")));

app.use("/user", require("./routes/userRoutes"));
app.use("/freelancer", require("./routes/freelancerRoutes"));
app.use("/client", require("./routes/clientRoutes"));
app.use("/otp", require("./routes/otpRoutes"));
app.use("/proposal", require("./routes/proposalRoutes"));
app.use("/conversation", require("./routes/conversationRoutes"));
app.use("/message", require("./routes/messageRoutes"));

app.listen(90, () => {
  console.log("Listening at port 90.");
});
