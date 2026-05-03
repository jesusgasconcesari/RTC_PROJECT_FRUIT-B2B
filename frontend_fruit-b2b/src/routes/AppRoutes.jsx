import { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

//Paginas
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";
import Products from "../pages/Products/Products.jsx";
import Cart from "../pages/Cart/Cart.jsx";
import AdminProducts from "../pages/AdminProducts/AdminProducts.jsx";
import AdminOrders from "../pages/AdminOrders/AdminOrders.jsx";
import MyOrders from "../pages/MyOrders/MyOrders.jsx";
import OrderDetail from "../pages/OrderDetail/OrderDetail.jsx";

import AdminRoute from "./AdminRoute";
import Home from "../pages/Home/Home.jsx";

//Ruta privada genneral
const PrivateRoute  = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    if (loading) {
        return <div>Cargando...</div>;
    }
    return user ? children : <Navigate to="/login" />;
};


const AppRoutes = () => {
    return (
        
            <Routes>
                {/* PUBLICAS */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Home />} />
                {/* CLIENTES */}
                <Route 
                    path="/products" 
                    element={
                            <PrivateRoute>
                                <Products />
                            </PrivateRoute>
                    } 
                />
                <Route
                    path="/cart"
                    element={
                        <PrivateRoute>
                            <Cart />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/my-orders"
                    element={
                        <PrivateRoute>
                            <MyOrders />
                        </PrivateRoute>
                    }
                /> 
                <Route
                    path="/my-orders/:id"
                    element={
                        
                            <OrderDetail />
                        
                    }
                />

                {/* ADMINS */}
                <Route
                    path="/admin/products"
                    element={
                        <AdminRoute>
                            <AdminProducts />
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/orders"
                    element={
                        <AdminRoute>
                            <AdminOrders />
                        </AdminRoute>
                    }
                />
                {/* POR DEFECTO */}
                <Route path="*" element={<Navigate to="/products" />} />
            </Routes>
        
    );
}

export default AppRoutes;