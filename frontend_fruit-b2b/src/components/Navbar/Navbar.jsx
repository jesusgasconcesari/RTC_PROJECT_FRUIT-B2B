import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";

import { AuthContext } from "../../context/AuthContext.jsx";
import { CartContext } from "../../context/CartContext.jsx";

import "./Navbar.css";

const Navbar = () => {

    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    const [showAdminMenu, setShowAdminMenu] = useState(false);

    const totalItems = cart.length;

    return (
        <nav className="navbar">

           
            <div className="navbar-logo">

                <NavLink to="/">

                    <img
                        src="../../../favicon.png"
                        alt="Logo"
                        className="logo-image"
                    />

                    <strong>Fruit B2B</strong>

                </NavLink>

            </div>

            
            <div className="navbar-links">

                {user && (
                    <>
                        <NavLink to="/products">
                            Productos
                        </NavLink>

                        <NavLink to="/cart">
                            Carrito ({totalItems})
                        </NavLink>

                        <NavLink to="/my-orders">
                            Mis pedidos
                        </NavLink>
                    </>
                )}

                
                {user?.role === "admin" && (

                    <div
                        className="admin-dropdown"
                        onMouseEnter={() => setShowAdminMenu(true)}
                        onMouseLeave={() => setShowAdminMenu(false)}
                    >

                        <button className="admin-dropdown-btn">
                            Panel Administrador ▾
                        </button>

                        {showAdminMenu && (

                            <div className="admin-dropdown-menu">

                                <NavLink to="/admin/products">
                                    Productos
                                </NavLink>

                                <NavLink to="/admin/orders">
                                    Pedidos
                                </NavLink>

                                <NavLink to="/admin/users">
                                    Usuarios
                                </NavLink>

                            </div>

                        )}

                    </div>

                )}

                {!user ? (
                    <>
                        <NavLink to="/login">
                            Iniciar Sesión
                        </NavLink>

                        <NavLink to="/register">
                            Registrarse
                        </NavLink>
                    </>
                ) : (
                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>
                )}

            </div>

        </nav>
    );
};

export default Navbar;