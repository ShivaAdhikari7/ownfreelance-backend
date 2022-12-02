const mongoose = require("mongoose");

const UserModel = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
  },
});

// module.exports = mongoose.model("User", UserModel);
const User = mongoose.model("User", UserModel);

module.exports = User;
