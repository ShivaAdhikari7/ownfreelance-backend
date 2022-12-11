const Freelancer = require("../models/freelancerModel");
const APIFeatures = require("../utils/apiFeatures");
const User = require("../models/userModel");
const Client = require("../models/clientModel");

const addFreelancerInfo = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400);
      throw new Error("User not authorized.");
    }

    const {
      userType,
      jobTitle,
      workExperiences,
      educationDetails,
      skills,
      bio,
      hourlyRate,
      preferences,
    } = req.body;

    const imgFile = req.file;

    if (
      !userType ||
      !jobTitle ||
      !workExperiences ||
      !educationDetails ||
      !skills ||
      !bio ||
      !hourlyRate ||
      !preferences
    ) {
      res.status(400);
      throw new Error("Please fill the required fields.");
    }

    if (!imgFile) {
      res.send({ message: "Please upload image." });
    }

    let imageUrl;
    if (imgFile) {
      const fileName = imgFile.filename;
      const basePath = `${req.protocol}://${req.get("host")}/images/`;
      imageUrl = basePath + fileName;
    }

    const data = await Freelancer.create({
      userType,
      jobTitle,
      workExperiences: JSON.parse(workExperiences),
      educationDetails: JSON.parse(educationDetails),
      hourlyRate,
      bio,
      skills: JSON.parse(skills),
      profilePictureUrl: imageUrl,
      userId: req.user.id,
      preferences: JSON.parse(preferences),
    });

    if (data) {
      res.send(data);
    }
  } catch (err) {
    res.send(err.message);
    console.error(err);
  }
};

const getAllFreelancers = async (req, res) => {
  try {
    const features = new APIFeatures(
      Freelancer.find().populate({
        path: "userId",
        select: "-password -verified -savedPostsId -savedPostsData",
      }),
      req.query
    );

    features.searchFreelancer().filter().sort().limitFields().paginate();

    const freelancers = await features.query;
    res.status(200).json({
      status: "success",
      data: {
        result: freelancers.length,
        freelancers,
      },
    });
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};
const getFreelancer = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Freelancer.findById(id).populate({
      path: "userId",
      select: "-password -verified -savedPostsId -savedPostsData",
    });
    if (!data) throw new Error("No freelancer found");

    res.status(200).json({
      freelancerData: data,
    });
  } catch (err) {
    res.json({ errorMessage: err.message });
  }
};

const deleteFreelancer = async (req, res) => {
  try {
    const freelancerId = req.params.id;

    const freelancerData = await Freelancer.findById(freelancerId);

    if (!freelancerData) {
      res.status(400);
      throw new Error("Freelancer data not found");
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    if (freelancerData.userId.toString() != user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await Freelancer.findByIdAndDelete(freelancerId);

    res.status(204).json({ status: "sucess", freelancerId });
  } catch (err) {
    res.json({ error: err.message });
  }
};

const updateFreelancer = async (req, res) => {
  try {
    const freelancerId = req.params.id;

    const freelancerData = await Freelancer.findById(freelancerId);

    if (!freelancerData) {
      res.status(400);
      throw new Error("No Freelancer found");
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    if (freelancerData.userId.toString() != user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const imgFile = req.file;
    let profilePictureUrl;

    if (imgFile) {
      const fileName = imgFile.filename;
      const basePath = `${req.protocol}://${req.get("host")}/images/`;
      profilePictureUrl = basePath + fileName;
    }

    const updatedFreelancer = await Freelancer.findByIdAndUpdate(
      freelancerId,
      {
        ...req.body,
        profilePictureUrl,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ updatedFreelancer });
  } catch (err) {
    res.json({ err: err.message });
  }
};

module.exports = {
  addFreelancerInfo,
  getAllFreelancers,
  getFreelancer,
  deleteFreelancer,
  updateFreelancer,
};
