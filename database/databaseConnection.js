const mongoose = require("mongoose");

mongoose.connect(`${process.env.MONGO_URI}/ownfreelance_db`, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
