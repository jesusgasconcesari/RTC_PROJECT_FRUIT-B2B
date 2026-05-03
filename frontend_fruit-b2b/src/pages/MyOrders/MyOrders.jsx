import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { getMyOrders } from "../../api/orders";
import { Link } from "react-router-dom";
import "./MyOrders.css";

const MyOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders(token);
        setOrders(data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  if (loading) return <p>Cargando pedidos...</p>;

  if (orders.length === 0) {
    return <p>No tienes pedidos todavía 📦</p>;
  }

  return (
    <div className="orders-page">

      <h2 className="page-title">Mis Pedidos</h2>

      {orders.length === 0 && (
        <p className="empty">No tienes pedidos aún</p>
      )}

      <div className="orders-grid">

        {orders.map((order) => (
          <div key={order._id} className="order-card">

            <div className="order-header">

              <strong>Pedido #{order._id.slice(-6)}</strong>

              <span
                className={`status status-${order.status}`}
              >
                {order.status}
              </span>

            </div>

            <p className="order-date">
              📅 {new Date(order.createdAt).toLocaleDateString()}
            </p>

            <div className="order-products">

              <strong>Productos:</strong>

              {order.products.slice(0, 3).map((p, i) => (
                <p key={i}>
                  • {p.product?.name || "Producto"} x{p.quantity}
                </p>
              ))}

              {order.products.length > 3 && (
                <p className="more-products">
                  +{order.products.length - 3} más...
                </p>
              )}

            </div>

            <div className="order-footer">

              <strong>Total: {order.totalPrice?.toFixed(2)}€</strong>

              <Link to={`/my-orders/${order._id}`}>
                <button className="btn primary">
                  Ver detalle
                </button>
              </Link>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default MyOrders;