const Client = require("../models/clientModel");

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
      workDuration,
      experienceLevel,
      hourlyRate,
      description,
    } = req.body;

    const file = req.file;

    if (
      !userType ||
      !headline ||
      !skills ||
      !scope ||
      !workDuration ||
      !experienceLevel ||
      !description
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
      const basePath = `${req.protocol}://${req.get("host")}/images/`;
      fileUrl = basePath + fileName;
    }

    const data = await Client.create({
      userType,
      headline,
      scope,
      skills: JSON.parse(skills),
      hourlyRate: hourlyRate,
      experienceLevel,
      workDuration: JSON.parse(workDuration),
      projectDescriptionFile: fileUrl,
      description: JSON.parse(description),
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

module.exports = { addClientInfo };
