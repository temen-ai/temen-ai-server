import express from 'express';
import MessageController from '../controllers/messageController.js';

const router = express.Router();

router.get('/', MessageController.getListMessage);
router.post('/', MessageController.postListMessage);

export default router;
