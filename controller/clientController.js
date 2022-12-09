const Client = require("../models/clientModel");
const APIFeatures = require("../utils/apiFeatures");

const addClientInfo = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400);
      throw new Error("User not authorized.");
    }

    const {
      userType,
      headline,
      skills,
      scope,
      hourlyRate,
      description,
      requiredJobTitle,
    } = req.body;

    const file = req.file;

    if (
      !userType ||
      !headline ||
      !skills ||
      !scope ||
      !description ||
      !requiredJobTitle
    ) {
      res.status(400);
      throw new Error("Please fill the required fields.");
    }

    if (!file) {
      throw new Error("Please fill the required fields");
    }

    let fileUrl;
    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/files/`;
      fileUrl = basePath + fileName;
    }

    const data = await Client.create({
      userType,
      headline,
      scope: JSON.parse(scope),
      skills: JSON.parse(skills),
      hourlyRate: hourlyRate,
      projectDescriptionFile: fileUrl,
      description,
      requiredJobTitle,
      userId: req.user.id,
    });

    if (data) {
      res.send(data);
    }
  } catch (err) {
    res.send(err.message);
    console.error(err);
  }
};

const getAllClients = async (req, res) => {
  try {
    const features = new APIFeatures(
      Client.find().populate({
        path: "userId",
        select: "-password -verified",
      }),
      req.query
    );

    features.searchClient().filter().sort().limitFields().paginate();

    const clients = await features.query;
    res.status(200).json({
      status: "success",
      data: {
        result: clients.length,
        clients,
      },
    });
  } catch (err) {
    res.status(200).json({
      status: "fail",
      message: err.message,
    });
  }
};

module.exports = { addClientInfo, getAllClients };
