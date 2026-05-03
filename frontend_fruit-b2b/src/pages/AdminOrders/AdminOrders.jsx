import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify';
  // import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import './AdminOrders.css';


const API_URL = "/api/orders/admin";

// Admin,admin@test.com,admin123,Fruteria Central,B00000000,Avenida Principal,admin

const AdminOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  // const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  // const handleView = (id) => {
  //   navigate(`/admin/orders/${id}`);
  // };

  const updateStatus = async (id, status) => {
    try {
      await fetch(`${API_URL}/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      toast.success(`Estado del pedido actualizado a ${status}`);
      fetchOrders();
    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar el estado del pedido");
    }
  };



  return (
    <div className="admin-orders-page">
      <h2 className="admin-orders-title">Panel Admin - Pedidos</h2>

      {orders.map((order) => (
        <div key={order._id} className="order-card">

          <div className="order-header">
            <p><strong>Cliente:</strong> {order.user?.businessName}</p>
            <span className={`status-badge ${order.status}`}>
              {order.status}
            </span>
          </div>

          <p className="order-total">
            Total: ${order.totalPrice.toFixed(2)}
          </p>

          <div className="order-actions">
            <button onClick={() => updateStatus(order._id, 'confirmed')}>Confirm</button>
            <button onClick={() => updateStatus(order._id, 'shipped')}>Send</button>
            <button onClick={() => updateStatus(order._id, 'delivered')}>Delivered</button>
            <button onClick={() => updateStatus(order._id, 'cancelled')}>Cancel</button>
          </div>

          <Link to={`/my-orders/${order._id}`} className="detail-link">
            Ver detalle
          </Link>

        </div>
      ))}
    </div>
  );
};

export default AdminOrders