import express from "express";
import { login,logout,register,checkAuth } from "../controllers/auth.controller.js";
import {authUser} from '../middlewares/authUser.js';

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/check-auth",authUser,checkAuth)

export default router;