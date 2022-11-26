const mongoose = require("mongoose");

const Client = new mongoose.Schema({
  userType: {
    type: String,
    required: true,
  },
  headline: {
    type: String,
    required: true,
  },
  skills: [{}],
  scope: {
    projectSize: {
      type: String,
      required: true,
    },
    projectDuration: {
      type: String,
      required: true,
    },
    projectExperienceLevel: {
      type: String,
      required: true,
    },
  },
  projectDescriptionFile: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  requiredJobTitle: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Client", Client);
