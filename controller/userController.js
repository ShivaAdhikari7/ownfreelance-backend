const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, country } = req.body;

    if (!firstName || !lastName || !password || !email || !country) {
      res.status(400);
      throw new Error("Please add all fields");
    }

    const isUserPresent = await User.findOne({ email });

    if (isUserPresent) {
      res.status(400);
      throw new Error("User already exists");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      country,
      verified: false,
    });

    if (userData) {
      res.status(200);

      res.json({
        _id: userData.id,
        statusCode: 200,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        token: generateToken(userData._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data.");
    }
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
};

module.exports = {
  registerUser,
};
