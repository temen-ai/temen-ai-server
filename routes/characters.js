import express from 'express';
import CharactersController from '../controllers/charactersController.js';

const router = express.Router();

router.get('/', CharactersController.getCharacter);
router.post('/', CharactersController.postCharacters);

export default router;
