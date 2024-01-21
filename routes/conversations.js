import express from "express";
import ConversationsController from "../controllers/conversationsController.js";

const router = express.Router();

router.get("/", ConversationsController.getConversation);
router.post("/", ConversationsController.postConversation);

export default router;
