import express from "express";
import UsersController from '../controllers/usersController.js';

const router = express.Router();

router.get('/', UsersController.getUser);
router.post('/', UsersController.updateUser);
router.get('/:id', UsersController.getUserProfile);

export default router;