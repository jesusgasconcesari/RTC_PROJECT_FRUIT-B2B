import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from '../controllers/product.controller.js';

import { isAuth, isAdmin } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Las rutas GET requieren usuario logueado

router.get('/', getProducts);
router.get('/:id', getProductById);

//Rutas admin

router.post('/', isAuth, isAdmin, createProduct);
router.put('/:id', isAuth, isAdmin, updateProduct);
router.delete('/:id', isAuth, isAdmin, deleteProduct);

export default router;