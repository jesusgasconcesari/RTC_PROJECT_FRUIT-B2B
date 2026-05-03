import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProducts } from "../../api/products";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { CartContext } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import "./Home.css";


const Home = () => {
  const [products, setProducts] = useState([]);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProducts();
  }, []);

  const seasonalProducts = products.filter(product => product.isSeasonal);
  return (
    <div className="home-page">

      {/* HERO */}
      <section className="hero">
        <div className="hero-overlay" />

        <div className="hero-content">
          <h1>Fruit B2B 🍎</h1>

          <p>
            Distribución de productos frescos para negocios.
            Rápido, fiable y al mejor precio.
          </p>

          <div className="hero-buttons">
            <Link to="/products">
              <button className="btn-primary">Ver catálogo</button>
            </Link>

            <Link to="/register">
              <button className="btn-secondary">Crear cuenta</button>
            </Link>
          </div>
        </div>
      </section>

      {/* SEASONAL PRODUCTS */}
      <section className="seasonal-section">

        <h2>🌱 Productos de temporada</h2>

        <div className="seasonal-scroll">

          {seasonalProducts.length === 0 && (
            <p>No hay productos de temporada ahora mismo</p>
          )}

          {seasonalProducts.map((product) => (
            <div key={product._id} className="seasonal-card">

              <div className="image-container">
                <img
                  src={product.image || "https://via.placeholder.com/300x200"}
                  alt={product.name}
                />
                <span className="badge">TEMPORADA</span>
              </div>

              <h4>{product.name}</h4>

              <p>
                {product.price}€ / {product.unit}
              </p>

              <button 
                disabled={!user}
                onClick={() => addToCart(product)}
                className={!user ? "disabled-btn" : ""}
              >
                {user ? "Añadir al carrito" : "Inicia sesión"}
              </button>

            </div>
          ))}

        </div>

      </section>

            {/* BENEFITS */}
      <section className="benefits-section">

        <h2>¿Por qué elegir Fruit B2B?</h2>

        <div className="benefits-grid">

          <div className="benefit-card">
            <span>⚡</span>
            <h3>Entrega rápida</h3>
            <p>Recibe tus pedidos en tiempo récord directamente en tu negocio.</p>
          </div>

          <div className="benefit-card">
            <span>💰</span>
            <h3>Precios competitivos</h3>
            <p>Compra al por mayor con los mejores precios del mercado.</p>
          </div>

          <div className="benefit-card">
            <span>🥇</span>
            <h3>Calidad garantizada</h3>
            <p>Productos frescos seleccionados directamente de proveedores.</p>
          </div>

        </div>

      </section>

      {/* CTA FINAL */}
      <section className="cta-section">

        <h2>Empieza a comprar hoy</h2>

        <p>
          Únete a cientos de negocios que ya confían en Fruit B2B
        </p>

        <div className="cta-buttons">
          {user ? (
            <button onClick={() => navigate("/products")}>
              Ir al catálogo
            </button>
          ) : (
            <>
              <button onClick={() => navigate("/register")}>
                Crear cuenta
              </button>

              <button
                className="secondary"
                onClick={() => navigate("/login")}
              >
                Iniciar sesión
              </button>
            </>
          )}
        </div>

      </section>

    </div>
  );
}
export default Home;