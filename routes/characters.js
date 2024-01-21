import express from "express";
import CharactersController from "../controllers/charactersController.js";

const router = express.Router();

router.get("/", CharactersController.getCharactersList);
router.get("/active/", CharactersController.getActiveCharactersList);
router.get("/:id", CharactersController.getCharacter);
router.post("/", CharactersController.postCharacters);

export default router;
