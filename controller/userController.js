const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Freelancer = require("../models/freelancerModel");
const Client = require("../models/clientModel");

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

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.status(200);
      res.json({
        userId: user._id,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.json({ message: err.message, stack: err.stack });
  }
};

const getUserInfo = async (req, res) => {
  try {
    if (!req.user) {
      res.status(400);
      throw new Error("User not authorized.");
    }

    let user;

    user = await Freelancer.findOne({
      userId: req.user._id,
    }).populate({
      path: "userId",
      select: "-password -verified",
    });

    if (!user) {
      user = await Client.findOne({ userId: req.user._id }).populate({
        path: "userId",
        select: "-password -verified",
      });
    }

    res.send({ user });
  } catch (err) {
    res.status(400).send({ errMsg: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) throw new Error("User doesn't exists.");

    const updatedUserData = await User.findByIdAndUpdate(userId, req.body, {
      new: true,
    });

    res.json({ updatedUserData: updatedUserData });
  } catch (err) {
    res.json({ errorMessage: err.message });
  }
};
const deleteUser = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) throw new Error("User doesn't exists.");

    await User.findByIdAndDelete(userId);
    res.json({ status: "success" });
  } catch (err) {
    res.json({ errorMessage: err.message });
  }
};

const savePost = async (req, res) => {
  try {
    const postId = req.params.id;
    let postData;
    postData = await Client.findById(postId).populate({
      path: "userId",
      select: "-password -verified",
    });

    if (!postData) {
      postData = await Freelancer.findById(postId).populate({
        path: "userId",
        select: "-password -verified",
      });
    }

    if (!postData) {
      res.status(400);
      throw new Error("No data found");
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      res.status(400);
      throw new Error("User not found");
    }
    console.log(user.savedPostsId);
    console.log(user.savedPostsId.includes(postId));

    if (!user.savedPostsId.includes(postId)) {
      await user.updateOne({ $push: { savedPostsData: postData } });
      await user.updateOne({ $push: { savedPostsId: postId } });
      res.status(200).json("The post has been saved");
    } else {
      await user.updateOne({ $pull: { savedPostsId: postId } });
      await user.updateOne({ $pull: { savedPostsData: postData } });

      res.status(200).json("The post has been removed from the saved library.");
    }
  } catch (err) {
    res.json({ err: err.message });
  }
};
const getAllSavedPosts = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    throw new Error("No user found");
  }

  const savedData = await User.findById(user._id).select("savedPostsData");
  res.status(200).json({
    savedData,
  });
};
const getUserInformation = async (req, res) => {
  try {
    let user;
    user = await Freelancer.findOne({
      userId: req.query.userId,
    }).populate({
      path: "userId",
      select: "-password -verified",
    });

    if (!user) {
      user = await Client.findOne({ userId: req.query.userId }).populate({
        path: "userId",
        select: "-password -verified",
      });
    }
    res.send({ user });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const usersId = [];
    const user = await User.find({});

    res.send({ user });
  } catch (err) {
    console.log(err);
  }
};

const getFriendInfo = async (req, res) => {
  try {
    let user;
    user = await Freelancer.findOne({
      _id: req.params.id,
    }).populate({
      path: "userId",
      select: "-password -verified",
    });

    if (!user) {
      user = await Client.findOne({ _id: req.params.id }).populate({
        path: "userId",
        select: "-password -verified",
      });
    }
    res.send({ user });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getallUsersId = async (req, res) => {
  try {
    const user1 = await Freelancer.find({})
      .select("_id profilePictureUrl")
      .populate({
        path: "userId",
        select: "firstName lastName",
      });
    const user2 = await Client.find({}).select("_id").populate({
      path: "userId",
      select: "firstName lastName -_id",
    });
    const user = [...user2, ...user1];
    res.send({ user });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserInfo,
  updateUser,
  deleteUser,
  savePost,
  getAllSavedPosts,
  getUserInformation,
  getAllUsers,
  getFriendInfo,
  getallUsersId,
};
