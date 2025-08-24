import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authUser = async (req, res, next) => {

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password -__v");
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};
