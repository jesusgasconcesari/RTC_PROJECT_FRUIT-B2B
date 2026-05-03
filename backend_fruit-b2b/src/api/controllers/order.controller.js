import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

//Crear pedido (solo para clientes)
export const createOrder = async (req, res) => {
    try {
        const { products } = req.body; //[{product: id, quantity}]
        // console.log("BODY", req.body);
        //calcular total
        const productsWithPrice = [];
        let totalPrice = 0;
        for (const item of products) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Producto con ID ${item.product} no encontrado` });
            }
            if(item.quantity < product.minOrderQuantity) {
                return res.status(400).json({ message: `La cantidad mínima para el producto ${product.name} es ${product.minOrderQuantity}` });
            }

            //guardar precio actual del producto en el pedido
            productsWithPrice.push({
                product: item.product,
                quantity: item.quantity,
                price: product.price
            });

            //actualizar stock
            product.stock -= item.quantity;
            await product.save();

            //calcular precio total
            totalPrice += product.price * item.quantity;
        }

        const order = new Order({
            user: req.user.id,
            products: productsWithPrice,
            totalPrice
        });

        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el pedido', error: error.message });
    }
};

//Obtener pedidos del cliente logeado
export const getMyOrders = async (req, res) => {    
    try {
        const orders = await Order.find({ user: req.user.id })
            .populate({
                path: 'products.product',
                select: 'name price',
                options: { strictPopulate: false }
            });        
            console.log("USER:", req.user);
            res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message });
    }
};

//Obtener todos los pedidos (solo para admin)
export const getAllOrders = async (req, res) => {
    try {
        console.log("GET /admin/ orders");
        const orders = await Order.find()
            .populate({
                path: 'user',
                select: 'name businessName'
            })
            .populate({
                path: 'products.product',
                select: 'name price',
                options: { strictPopulate: false }
            });
        console.log("ORDERS OK:", orders.length);
        res.json(orders);
    } catch (error) {
        console.error("ERROR GET ALL ORDERS", error);
        res.status(500).json({ message: 'Error al obtener los pedidos', error: error.message });
    }
};

//Actualizar estado del pedido (solo para admin)
export const updateOrderStatus = async (req, res) => {  
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        if (status === "cancelled" && order.status !== "cancelled") {
            // Devolver el stock de los productos
            for (const item of order.products) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock += item.quantity;
                    await product.save();
                }
            }
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el estado del pedido', error: error.message });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
           .populate({
                path: "user",
                select: "name businessName"
            })
            .populate({
                path: "products.product",
                select: "name price",
                options: { strictPopulate: false }
            });
    

        if (!order) {
            return res.status(404).json({ message: 'Pedido no encontrado' });
        }

        // Verificar que el usuario sea el dueño del pedido o un admin
        const orderUserID = order.user._id.toString();

        if(orderUserID !== req.user.id && req.user.role !== "admin") {
            return res.status(403).json({ message: 'No tienes permiso para ver este pedido' });
        }
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el pedido', error: error.message });
    }
};
