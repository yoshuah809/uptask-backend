import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const checkAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      req.user = await User.findById(decoded.id).select("email username");

      return next();
    } catch (error) {
      return res
        .status(404)
        .json({ message: ", There Was an Error, Invalid token" });
    }
  }

  if (!token) {
    const error = new Error("Not authorized, no token");
    return res.status(401).json({ message: error.message });
  }
  next();
};
export default checkAuth;
