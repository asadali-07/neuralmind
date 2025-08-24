import express from "express";
import { createChat, getChat, deleteChat, getAllChat, editChatTitle } from '../controllers/chat.controller.js';
import {authUser} from '../middlewares/authUser.js';


const router = express.Router();

router.get("/", authUser, getAllChat);
router.post("/", authUser, createChat);
router.get("/:id", authUser, getChat);
router.delete("/:id",authUser, deleteChat);
router.put("/:id", authUser, editChatTitle);

export default router;