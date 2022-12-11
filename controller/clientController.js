const Client = require("../models/clientModel");
const User = require("../models/userModel");
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
        select: "-password -verified -savedPostsId -savedPostsData",
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
const getClient = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await Client.findById(id).populate({
      path: "userId",
      select: "-password -verified -savedPostsId -savedPostsData",
    });
    if (!data) throw new Error("No Client found");

    res.status(200).json({
      clientData: data,
    });
  } catch (err) {
    res.json({ errorMessage: err.message });
  }
};

const deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    const clientData = await Client.findById(clientId);

    if (!clientData) {
      res.status(400);
      throw new Error("Client data not found");
    }

    const user = await Client.findById(req.user.id);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    if (clientData.userId.toString() != user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    await Client.findByIdAndDelete(clientId);
    res.status(204).json({ status: "success", clientId });
  } catch (err) {
    res.json({ error: err.message });
  }
};

const updateClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    const clientData = await Client.findById(clientId);

    if (!clientData) {
      res.status(400);
      throw new Error("No Client found");
    }

    const user = await User.findById(req.user.id);
    console.log(user);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }

    if (clientData.userId.toString() != user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }
    const file = req.file;
    let fileUrl;
    if (file) {
      const fileName = file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/files/`;
      fileUrl = basePath + fileName;
    }

    const updatedClient = await Client.findByIdAndUpdate(
      clientId,
      {
        ...req.body,
        fileUrl,
      },
      {
        new: true,
      }
    );
    res.status(200).json({ updatedClient });
  } catch (err) {
    res.json({ err: err.message });
  }
};

module.exports = {
  addClientInfo,
  getAllClients,
  getClient,
  updateClient,
  deleteClient,
};
