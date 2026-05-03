import { useEffect, useState, useContext} from "react";
import { AuthContext } from "../../context/AuthContext";
import { getProducts } from "../../api/products";

import { CartContext } from "../../context/CartContext";

import "./Products.css";

const Products = () => {
  const { token } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const { addToCart } = useContext(CartContext);
  const [search, setSearch] = useState(""); 
  const [category, setCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(token);
        setProducts(data);
      } catch (error) {
        console.log(error);
        setError("Error al cargar productos");
      }
    };
    fetchProducts();
  }, [token]);

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === "" || product.category === category)
    );
  });

  return (
    <div className="products-page">

      <h2 className="products-title">Catálogo de Productos</h2>

      {error && <p className="error-text">{error}</p>}

      {/* FILTERS */}
      <div className="products-filters">

        <input
          type="text"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          <option value="Fruta">Fruta</option>
          <option value="Verdura">Verdura</option>
          <option value="Lácteo">Lácteo</option>
          <option value="Cereal">Cereal</option>
          <option value="Panadería">Panadería</option>
          <option value="Condimento">Condimento</option>
          <option value="Dulce">Dulce</option>
          <option value="Bebida">Bebida</option>
        </select>

      </div>

      {/* GRID */}
      <div className="products-grid">

        {filteredProducts.length === 0 && (
          <p className="empty-text">No se encontraron productos</p>
        )}

        {filteredProducts.map((product) => (
          <div key={product._id} className="product-card">

            <img
              src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={product.name}
              className="product-image"
            />

            <h3 className="product-name">{product.name}</h3>

            <p className="product-price">
              {product.price}$ / {product.unit}
            </p>

            <p className="product-min">
              Pedido mínimo: {product.minOrderQuantity} {product.unit}
            </p>

            <button onClick={() => addToCart(product)}>
              Añadir al carrito
            </button>

          </div>
        ))}

      </div>

    </div>
  );
};

export default Products