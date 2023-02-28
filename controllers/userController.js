import User from "../models/Usuario.js";

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    const error = new Error("User already exists");
    return res.status(400).json({ msg: error.message });
  }

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
