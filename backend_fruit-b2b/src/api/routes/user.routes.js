import express from 'express';
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
}  from '../controllers/user.controller.js';

import { isAuth, isAdmin } from '../../middlewares/auth.middleware.js';

const router = express.Router();

//solo admin

router.get('/', isAuth, isAdmin, getAllUsers);
router.get('/:id', isAuth, isAdmin, getUserById);
router.put('/:id', isAuth, isAdmin, updateUser);
router.delete('/:id', isAuth, isAdmin, deleteUser);

export default router;


