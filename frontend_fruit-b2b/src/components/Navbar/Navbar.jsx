import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext.jsx";
import { CartContext } from "../../context/CartContext.jsx";
import "./Navbar.css";

const Navbar = () => {
    const {user, logout} = useContext(AuthContext);
    const { cart } = useContext(CartContext);

    const totalItems = cart.length;

    return (
    <nav className="navbar">

        {/* LOGO */}
        <div className="navbar-logo">
        <NavLink to="/">
            <>
             <img src="../../../favicon.png" alt="Logo" className="logo-image" />
            <strong>Fruit B2B</strong>
           
            </>
            
        </NavLink>
        </div>

        {/* LINKS */}
        <div className="navbar-links">

        {user && (
            <>
            <NavLink to="/products">
                Catálogo de productos
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
            <>
            <NavLink to="/admin/products">Admin Productos</NavLink>
            <NavLink to="/admin/orders">Admin Pedidos</NavLink>
            </>
        )}

        {!user ? (
            <>
            <NavLink to="/login">Iniciar Sesión</NavLink>
            <NavLink to="/register">Registrarse</NavLink>
            </>
        ) : (
            <button className="logout-btn" onClick={logout}>
            Logout
            </button>
        )}

        </div>

    </nav>
    );
};

export default Navbar; 

