import { useContext, useState } from "react"
import { CartContext } from "../../context/CartContext";
import { AuthContext } from "../../context/AuthContext";
import { createOrder} from "../../api/orders";
import { toast } from "react-toastify";
import "./Cart.css";

const Cart = () => {
  const {cart, removeFromCart, clearCart, increaseQuantity, decreaseQuantity} = useContext(CartContext);
  const { token } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleOrder = async() => {
    if (cart.length === 0) {
      toast.warning("Tu carrito está vacío");
      return;
    }

    try {
      setLoading(true);

      const orderData = {
        products: cart.map(item => ({
          product: item.product._id || item.product,
          quantity: item.quantity
        }))
      };
      // console.log("ORDER DATA:", orderData); 
      await createOrder(orderData, token);

      toast.success("Pedido realizado con éxito");
      clearCart();

    } catch (err) {
      console.log(err);
      toast.error("Error al realizar el pedido");
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div className="cart-page">

      <h2 className="cart-title">Carrito</h2>

      {cart.length === 0 && (
        <p className="empty-cart">Tu carrito está vacío</p>
      )}

      {/* ITEMS */}
      <div className="cart-items">

        {cart.map((item) => (
          <div key={item.product._id} className="cart-item">

            <div className="cart-info">
              <h3>{item.product.name}</h3>
              <p className="unit-price">
                Precio unitario: {item.product.price}$
              </p>
            </div>

            <div className="cart-controls">

              <button onClick={() => decreaseQuantity(item.product._id)}>
                −
              </button>

              <span>
                {item.quantity} {item.product.unit}
              </span>

              <button onClick={() => increaseQuantity(item.product._id)}>
                +
              </button>

            </div>

            <p className="subtotal">
              Subtotal: {(item.product.price * item.quantity).toFixed(2)}$
            </p>

            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.product._id)}
            >
              Eliminar
            </button>

          </div>
        ))}

      </div>

      {/* SUMMARY */}
      {cart.length > 0 && (
        <div className="cart-summary">

          <h3>Total: {totalPrice.toFixed(2)}$</h3>

          <button
            className="checkout-btn"
            onClick={handleOrder}
            disabled={loading}
          >
            {loading ? "Procesando pedido..." : "Realizar Pedido"}
          </button>

        </div>
      )}

    </div>
  );
};

export default Cart