const mongoose = require("mongoose");

const Proposal = new mongoose.Schema({
  bidRate: {
    type: Number,
    required: true,
  },
  coverLetter: {
    type: String,
    required: true,
  },
  attachedFileUrl: {
    type: String,
  },
  freelancerId: {
    type: mongoose.Schema.ObjectId,
    ref: "Freelancer",
    required: true,
  },
  attachmentName: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  notification: {
    label: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
    },
  },
});

module.exports = mongoose.model("Proposal", Proposal);
