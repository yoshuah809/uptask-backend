import { emailForgotPassword, registerEmail } from "../helpers/email..js";
import GenerateId from "../helpers/generateId.js";
import generateToken from "../helpers/generateJWT.js";
import User from "../models/user.model.js";

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  console.log(username);
  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("User already exists");
    return res.status(400).json({ message: error.message });
  }

  try {
    const user = new User(req.body);
    user.token = GenerateId();
    await user.save();

    //Send Confirmation email
    registerEmail({
      email: user.email,
      username: user.username,
      token: user.token,
    });

    res.json({
      message:
        "User created successfully, check your email to confirm your account ",
    });
  } catch (error) {
    console.log(error);
  }
};

const authenticate = async (req, res) => {
  const { email, password } = req.body;
  //check if user exist
  const user = await User.findOne({ email });
  if (!user) {
    const errors = new Error("User not found");
    return res.status(400).json({ msg: errors.message });
  }
  //check if user has been confirmed
  if (!user.confirmed) {
    const error = new Error("User has not been confirmed");
    return res.status(403).json({ msg: error.message });
  }
  //compare password
  if (await user.comparePassword(password)) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(403).json({ message: "password is incorrect" });
  }
};

const confirm = async (req, res) => {
  const { token } = req.params;
  const userConfirm = await User.findOne({ token });
  if (!userConfirm) {
    const error = new Error("Invalid Token");
    return res.status(400).json({ msg: error.message });
  }
  try {
    userConfirm.confirmed = true;
    userConfirm.token = "";
    await userConfirm.save();
    res.status(201).json({ message: "The user Account has been Confirmed" });
  } catch (error) {
    console.log(error);
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User does not exists");
    return res.status(400).json({ msg: error.message });
  }

  try {
    user.token = GenerateId();
    await user.save();
    //send email notification
    emailForgotPassword({
      email: user.email,
      username: user.username,
      token: user.token,
    });

    res.json({
      msg: "We have sent an email with the instructions",
    });
  } catch (error) {
    console.log(error);
  }
};

const verifyToken = async (req, res) => {
  const { token } = req.params;

  const validToken = await User.findOne({ token });

  if (validToken) {
    res.json({ message: "Valid Token and User Exists" });
  } else {
    const error = new Error("Invalid token");
    return res.status(404).json({ msg: error.message });
  }
};
const newPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const user = await User.findOne({ token });

  if (user) {
    user.password = password;
    user.token = "";
    try {
      await user.save();
      res.json({ msg: "Password has been modified" });
    } catch (error) {
      console.log(error);
    }
  } else {
    console.log("Invalid token");
  }
};

const profile = async (req, res) => {
  const { user } = req;
  //res.json(user).select("-createdAt -confirm");
  res.json(user);
};

export default {
  registerUser,
  confirm,
  authenticate,
  forgotPassword,
  verifyToken,
  newPassword,
  profile,
};
