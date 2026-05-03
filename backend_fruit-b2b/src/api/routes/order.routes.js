import express from 'express';
import {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
    getOrderById
} from '../controllers/order.controller.js';

import { isAuth, isAdmin } from '../../middlewares/auth.middleware.js';

const router = express.Router();

//Clientes
router.post('/', isAuth, createOrder);
router.get('/my-orders', isAuth, getMyOrders);

//Admin
router.get('/admin', isAuth, isAdmin, getAllOrders);
router.put('/admin/:id/status', isAuth, isAdmin, updateOrderStatus);

router.get('/:id', isAuth, getOrderById); 

export default router;

