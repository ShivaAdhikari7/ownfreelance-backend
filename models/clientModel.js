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
    type: String,
    required: true,
  },
  workDuration: {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
  },

  experienceLevel: {
    type: String,
    required: true,
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

  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("Client", Client);
