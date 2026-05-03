import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { getOrderById } from "../../api/orders";
import { useNavigate } from "react-router-dom";
import "./OrderDetail.css";

const OrderDetail = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(id, token);
        setOrder(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrder();
  }, [id]);

  if (!order) return <p>Cargando pedido...</p>;

  const steps = [
    "pending",
    "confirmed",
    "shipped",
    "delivered"
  ];

  const currentStepIndex = steps.indexOf(order.status);

  console.log("ORDER DETAIL:", order);

  return (
    <div className="order-detail">

      <button className="back-button" onClick={() => navigate(-1)}>
        ← Volver
      </button>

      <div className="order-header">
        <h2>Pedido #{order._id.slice(-6)}</h2>

        <p className="order-date">
          📅 {new Date(order.createdAt).toLocaleString()}
        </p>

        <p className="order-status">
          Estado: <strong>{order.status}</strong>
        </p>
      </div>

      <div className="timeline">
        {steps.map((step, index) => (
          <div
            key={step}
            className={`timeline-step ${
              index <= currentStepIndex ? "active" : ""
            }`}
          >
            {step.toUpperCase()}
          </div>
        ))}
      </div>

      <div className="products">
        <h3>Productos</h3>

        {order.products.map((item) => (
          <div
            key={item.product?._id || item._id}
            className="product-row"
          >
            <span className="product-name">
              {item.product?.name || "Producto"}
            </span>

            <span className="product-qty">
              x{item.quantity}
            </span>

            <span className="product-price">
              {((item.price || item.product?.price || 0) * item.quantity).toFixed(2)}€
            </span>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="order-total">
        <h2>Total: {order.totalPrice?.toFixed(2)}€</h2>
      </div>

    </div>
  );
};

export default OrderDetail;