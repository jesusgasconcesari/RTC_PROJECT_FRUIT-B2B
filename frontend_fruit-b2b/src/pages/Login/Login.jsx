import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { loginUser } from "../../api/auth";
import "./Login.css";


const Login = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const data = await loginUser(email, password);
            login(data.user, data.token);
            navigate("/products");
        } catch (err) {
            setError(err.message || "Login failed");
        }
    };

    return (
        <div className="login-page">

            {/* OVERLAY oscuro */}
            <div className="login-overlay" />

            <div className="login-card">

            <h2 className="login-title">Bienvenido 👋</h2>

            <p className="login-subtitle">
                Inicia sesión para acceder al catálogo y gestionar tus pedidos de forma rápida y sencilla.
            </p>

            <form onSubmit={handleSubmit} className="login-form">

                <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />

                <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />

                <button type="submit">
                Entrar
                </button>

                {error && <p className="login-error">Usuario o contraseña incorrectos</p>}

            </form>

            {/* LINK A REGISTER */}
            <p className="login-footer">
                ¿No tienes cuenta?{" "}
                <span onClick={() => navigate("/register")}>
                Regístrate aquí
                </span>
            </p>

            </div>

        </div>
        );
};

export default Login