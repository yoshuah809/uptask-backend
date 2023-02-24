import User from "../models/Usuario.js";

const registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.json(savedUser);
  } catch (error) {
    console.log(error);
  }
};

const createUser = (req, res) => {
  res.json({ msg: "Creating User" });
};

export { registerUser, createUser };
