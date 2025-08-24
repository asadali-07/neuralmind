import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function login(req, res) {

  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true });
  res.json({ user: { name: user.name, email: user.email }});
}

export async function register(req, res) {

  const { name, email, password } = req.body;

  const hasPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hasPassword });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.cookie("token", token, { httpOnly: true });

   res.json({ user: { name: user.name, email: user.email }});
}

export async function checkAuth(req, res) {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ",error.message);
        res.status(500).json({message:"Internal server error"});
    }
}

export async function logout(_, res) {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
}
