const Proposal = require("../models/proposalModel");
const Freelancer = require("../models/freelancerModel");
const User = require("../models/userModel");

const addProposal = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400);
      throw new Error("User not authorized.");
    }

    const {
      bidRate,
      coverLetter,
      userId,
      notification,
      attachmentName,
      jobTitle,
    } = req.body;

    const attachmentFile = req.file;

    if (!bidRate || !coverLetter || !userId || !notification || !jobTitle) {
      res.status(400);
      throw new Error("Please fill the required fields.");
    }

    let attachedFileUrl = "";

    if (attachmentFile) {
      const fileName = attachmentFile.filename;
      const basePath = `${req.protocol}://${req.get("host")}/files/`;

      attachedFileUrl = basePath + fileName;
    }

    const freelancerId = await Freelancer.findOne({
      userId: req.user._id,
    }).select("_id");

    const data = await Proposal.create({
      bidRate: +bidRate,
      coverLetter,
      freelancerId,
      jobTitle,
      attachmentName,
      attachedFileUrl: attachedFileUrl,
      notification: JSON.parse(notification),
      userId,
    });

    if (data) res.send(data);
  } catch (err) {
    res.send(err.stack);
  }
};

const getAllNotifications = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400);
      throw new Error("User not authorized.");
    }

    const data = await Proposal.find({ userId: req.user._id }).select(
      "notification"
    );

    res.send(data);
  } catch (err) {
    res.send(err.stack);
  }
};

const getApplicantDetail = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400);
      throw new Error("User not authorized.");
    }

    const { proposalId } = req.params;

    if (!proposalId) {
      res.status(404);
      throw new Error("No any proposal id found.");
    }

    const proposalData = await Proposal.findById(proposalId);

    const freelancerData = await Freelancer.findById(
      proposalData.freelancerId
    ).select("-userId");

    const userInfo = await Freelancer.findById(
      proposalData.freelancerId
    ).select("userId");

    const userData = await User.findById(userInfo.userId);

    const allData = {
      proposalData,
      freelancerDetail: { freelancerData, userId: userData },
    };

    res.send(allData);
  } catch (err) {
    res.send(err.stack);
  }
};

const updateProposal = async (req, res) => {
  try {
    const { proposalId } = req.params;

    console.log(req.body.read);

    if (!proposalId) {
      res.status(404);
      throw new Error("Proposal id not found.");
    }

    const updatedProposalData = await Proposal.findByIdAndUpdate(proposalId, {
      $set: { "notification.read": req.body.read },
    });

    res.json({ updatedProposalData });
  } catch (err) {
    res.send(err.message);
  }
};

module.exports = {
  addProposal,
  getAllNotifications,
  getApplicantDetail,
  updateProposal,
};
