const mongoose = require("mongoose");

const FreelancerModel = new mongoose.Schema({
  userType: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  workExperiences: [{}],
  educationDetails: [{}],
  skills: [{}],
  bio: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
  profilePictureUrl: {
    type: String,
    required: true,
  },
  preferences: {
    language: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },

  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

const Freelancer = mongoose.model("Freelancer", FreelancerModel);

module.exports = Freelancer;
