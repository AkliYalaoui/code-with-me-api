const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userFound = await User.findOne({ email });

    if (userFound) {
      return res.status(400).json({
        status: 400,
        message: "User already registred",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    if (!salt || !hashedPassword) {
      return res.status(502).json({
        status: 502,
        message: "server error while creating new user",
      });
    }

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!user) {
      return res.status(502).json({
        status: 502,
        message: "server error while creating new user",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(201).json({
      status : 201,
      message: "User created successfully",
      user: {
        _id: user._id,
        username,
        email,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "something went wrong",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "Bad credentials, User not found",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(404).json({
        status: 404,
        message: "Bad credentials, User not found",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    res.status(200).json({
      status : 200,
      message: "User logged in successfully",
      user: {
        _id: user._id,
        username: user.username,
        email,
        token,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "something went wrong",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    const user = await User.findById(id, { password: 0 });
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      status: 500,
      message: "something went wrong",
    });
  }
};

module.exports = { registerUser, loginUser, getProfile };
