const mongoose = require("mongoose");

mongoose.connect(`${process.env.MONGO_URI}/bookverse_db`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
