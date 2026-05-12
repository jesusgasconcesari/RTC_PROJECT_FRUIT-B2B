import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, loginUser } from "../../api/auth";
import { AuthContext } from "../../context/AuthContext";

import "./Register.css";



const Register = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        businessName: "",
        CIF: "",
        address: ""
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await registerUser(form);

            const loginResponse = await loginUser(form.email, form.password);

            console.log(loginResponse);

            login(loginResponse.user, loginResponse.token);

            navigate("/products");
        } catch (err) {
            setError(err.message || "Registration failed");
        }
    };

    return (
        <div className="register-page">

            {/* OVERLAY */}
            <div className="register-overlay" />

            <div className="register-card">

            <h2 className="register-title">Crear cuenta 🧾</h2>

            <p className="register-subtitle">
                Regístrate para acceder al catálogo y realizar pedidos como empresa.
            </p>

            <form onSubmit={handleSubmit} className="register-form">

                <input name="name" placeholder="Nombre" onChange={handleChange} required />
                <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
                <input name="password" type="password" placeholder="Contraseña" onChange={handleChange} required />

                <input name="businessName" placeholder="Nombre de la empresa" onChange={handleChange} required />
                <input name="CIF" placeholder="CIF" onChange={handleChange} required />
                <input name="address" placeholder="Dirección" onChange={handleChange} required />

                <button type="submit">
                Crear cuenta
                </button>

                {error && <p className="register-error">{error}</p>}

            </form>

            <p className="register-footer">
                ¿Ya tienes cuenta?{" "}
                <span onClick={() => navigate("/login")}>
                Inicia sesión
                </span>
            </p>

            </div>

        </div>
        );
};

export default Register