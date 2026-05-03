import fs from 'fs';
import csvParser from 'csv-parser';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import { connectDB } from '../config/db.js';

import { User } from '../api/models/User.js';
import { Product } from '../api/models/Product.js';
import { Order } from '../api/models/Order.js';

dotenv.config();
await connectDB();

//Leer el CSV
const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => resolve(results))
            .on('error', (error) => reject(error));
    });
};

const seedUsers = async () => {
    const users = await readCSV('./src/seeds/csv/users.csv');
    for (let user of users) {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        await User.create({ ...user, password: hashedPassword });
    }
    console.log('Users seeded');
};

const seedProducts = async () => {
    const products = await readCSV('./src/seeds/csv/products.csv');
    for (let product of products) {
        product.price = parseFloat(product.price);
        product.stock = parseInt(product.stock);
        product.isSeasonal = product.isSeasonal.toLowerCase() === 'true';
        product.minOrderQuantity = parseInt(product.minOrderQuantity);
        await Product.create(product);
    }
    console.log('Products seeded');
};

// Generar pedidos aleatorios usando usuarios y productos creados
const seedOrders = async () => {
    const users = await User.find({ role: "client"});
    const products = await Product.find();

    for (let i = 0; i < 20; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const productItems = [];
        const numberOfProducts = Math.floor(Math.random() * 5) + 1; // Entre 1 y 5 productos por pedido

        let totalPrice = 0;
        for (let j = 0; j < numberOfProducts; j++) {
            const randomProduct = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 10) + 1; // Entre 1 y 10 unidades
            productItems.push({ 
                product: randomProduct._id, 
                quantity,
                price: randomProduct.price
            });
            totalPrice += randomProduct.price * quantity;
        }

        await Order.create({
            user: randomUser._id,
            products: productItems,
            totalPrice,
            status: 'pending',
        });
    }
    console.log('Orders seeded');
};

//Ejecutar seeds
const seedAll = async () => {
    try {
        await User.deleteMany();
        await Product.deleteMany();
        await Order.deleteMany();

        await seedUsers();
        await seedProducts();
        await seedOrders();
        console.log('All data seeded successfully');
        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

seedAll();