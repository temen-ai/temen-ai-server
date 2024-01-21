import express from "express";
import UsersController from '../controllers/usersController.js';

const router = express.Router();

router.get('/', UsersController.getUser);
router.post('/', UsersController.postUser);

export default router;