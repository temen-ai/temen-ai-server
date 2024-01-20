import express from 'express';
import charactersRouter from './characters.js';
import messagesRouter from './messages.js';
import conversationsRouter from './conversations.js';

const router = express.Router();

// Use the individual routers
router.use('/characters', charactersRouter);
router.use('/messages', messagesRouter);
router.use('/conversations', conversationsRouter);

export default router;
