const Freelancer = require("../models/freelancerModel");
const APIFeatures = require("../utils/apiFeatures");

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
        select: "-password -verified",
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

module.exports = { addFreelancerInfo, getAllFreelancers };
