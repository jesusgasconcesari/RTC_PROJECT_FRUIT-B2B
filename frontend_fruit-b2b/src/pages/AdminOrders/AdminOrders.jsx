import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { toast } from 'react-toastify';
  // import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import { useMemo } from "react";
import './AdminOrders.css';


const API_URL = "/api/orders/admin";

// Admin,admin@test.com,admin123,Fruteria Central,B00000000,Avenida Principal,admin

const AdminOrders = () => {
  const { token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  // const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const STATUS_FLOW = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["shipped", "cancelled"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: []
  }

  const canChangeStatus = (current, next) => {
    return STATUS_FLOW[current]?.includes(next);
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : data.orders || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]);

  const updateStatus = async (order, status) => {
    if (!canChangeStatus(order.status, status)) {
      toast.error(`No se puede cambiar el estado de ${order.status} a ${status}`);
      return;
    }

    try {
      await fetch(`${API_URL}/${order._id}/status`, {
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


  const filteredOrders = useMemo(() => {

    const isDefaultFilter =
      search.trim() === "" &&
      statusFilter === "all";

    if (isDefaultFilter) return orders;

    const searchText = search.toLowerCase();

    return orders.filter((order) => {

      const id = String(order._id || "");
      const businessName = order.user?.businessName || "";

      const matchesSearch =
        id.toLowerCase().includes(searchText) ||
        businessName.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "all" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

  }, [orders, search, statusFilter]);

  return (
    <div className="admin-orders-page">
      <h2 className="admin-orders-title">Panel Admin - Pedidos</h2>

      <div className="orders-filters">

        <input
          type="text"
          placeholder="Buscar por empresa o ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">Todos</option>
          <option value="pending">Pendiente</option>
          <option value="confirmed">Confirmado</option>
          <option value="shipped">Enviado</option>
          <option value="delivered">Entregado</option>
          <option value="cancelled">Cancelado</option>
        </select>

      </div>
{orders.length === 0 ? (
  <p>Cargando pedidos...</p>
) : (
      filteredOrders.map((order) => (
        <div key={order._id} className="order_card">

          <div className="order_header">
            <p><strong>Cliente:</strong> {order.user?.businessName}</p>
            <span className={`status-badge ${order.status}`}>
              {order.status}
            </span>
          </div>

          <p className="order_total">
            Total: ${order.totalPrice.toFixed(2)}
          </p>

          <div className="order_actions">
            <button onClick={() => updateStatus(order, 'confirmed')} disabled={!canChangeStatus(order.status, 'confirmed')}>Confirm</button>
            <button onClick={() => updateStatus(order, 'shipped')} disabled={!canChangeStatus(order.status, 'shipped')}>Send</button>
            <button onClick={() => updateStatus(order, 'delivered')} disabled={!canChangeStatus(order.status, 'delivered')}>Delivered</button>
            <button onClick={() => updateStatus(order, 'cancelled')} disabled={!canChangeStatus(order.status, 'cancelled')}>Cancel</button>
          </div>

          <Link to={`/my-orders/${order._id}`} className="detail_link">
            Ver detalle
          </Link>

        </div>
      )))}
    </div>
  );
};

export default AdminOrders