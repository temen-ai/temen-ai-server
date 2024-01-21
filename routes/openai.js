import express from "express";
import OpenaiController from "../controllers/openaiController.js";

const router = express.Router();

// router.post("/", openaiController.postOpenAI);
router.get("/", OpenaiController.getOpenAI);

export default router;
