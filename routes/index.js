import express from 'express';
import charactersRouter from './characters.js';
import messagesRouter from './messages.js';
import conversationsRouter from './conversations.js';
import usersRouter from './users.js'

const router = express.Router();

// Use the individual routers
router
    .use('/characters', charactersRouter)
    .use('/messages', messagesRouter)
    .use('/conversations', conversationsRouter)
    .use('/users', usersRouter);

export default router;
