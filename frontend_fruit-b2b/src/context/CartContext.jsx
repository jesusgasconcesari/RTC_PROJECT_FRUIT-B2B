import { createContext, useState, useEffect, useRef} from "react";
import { toast } from "react-toastify";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem("cart");
        return storedCart ? JSON.parse(storedCart) : [];
    });

    const isFirstRender = useRef(true);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    //Añadir producto al carrito
    const addToCart = (product) => {
        setCart((prev) => {
            const exists = prev.find(
                (item) => item.product._id === product._id
            );

            if(exists && exists.quantity + product.minOrderQuantity > product.stock) {
                if (!isFirstRender.current) toast.error("No hay suficiente stock disponible");
                return prev;
            }

            if (exists) {
                if (!isFirstRender.current) toast.info(`Cantidad de ${product.name} actualizada en el carrito`);
                return prev.map((item) =>
                    item.product._id === product._id
                        ? { ...item, quantity: item.quantity + product.minOrderQuantity }
                        : item
                );
            } 
            if (!isFirstRender.current) toast.success(`${product.name} añadido al carrito`);
            return [...prev, { product, quantity: product.minOrderQuantity }];
        });
    };

    //Eliminar producto del carrito
    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.product._id !== id));
        if (!isFirstRender.current) toast.info("Producto eliminado del carrito");
    };

    //Vaciar el carrito
    const clearCart = () => {
        setCart([]);
        if (!isFirstRender.current) toast.info("Carrito vaciado");
    };

    // Increementar cantidad del producto en el carrito
    const increaseQuantity = (productId) => {
    setCart(prev =>
        prev.map(item => {
        if (item.product._id === productId) {

            if (item.quantity + 1 > item.product.stock) {
            toast.error("No puedes superar el stock disponible");
            return item;
            }

            return {
            ...item,
            quantity: item.quantity + 1
            };
        }
        return item;
        })
    );
    };

    // Decrementar cantidad del producto en el carrito
    const decreaseQuantity = (productId) => {
    setCart(prev =>
        prev.map(item => {
        if (item.product._id === productId) {

            if (item.quantity - 1 < item.product.minOrderQuantity) {
            toast.warning(`La cantidad mínima de pedido es ${item.product.minOrderQuantity} ${item.product.unit}`);
            return item;
            }

            return {
            ...item,
            quantity: item.quantity - 1
            };
        }
        return item;
        })
    );
    };

    useEffect(() => {
        isFirstRender.current = false;
    }, []);


    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity }}>
            {children}
        </CartContext.Provider>
    );
};