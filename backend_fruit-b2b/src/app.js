import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import {User} from './api/models/User.js';
import { Product } from './api/models/Product.js';
import { Order } from './api/models/Order.js';

import authRoutes from './api/routes/auth.routes.js';
import productRoutes from './api/routes/product.routes.js';
import orderRoutes from './api/routes/order.routes.js';
import userRoutes from './api/routes/user.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Fruit B2B Funcionando');
});

app.use('/api/auth', authRoutes);

app.use('/api/products', productRoutes);

app.use('/api/orders', orderRoutes);

app.use('/api/users', userRoutes);


export default app;
