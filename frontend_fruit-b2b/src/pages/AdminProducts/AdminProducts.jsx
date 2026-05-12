import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import "./AdminProducts.css";

const API_URL = "https://rtc-project-fruit-b2b.onrender.com/api/products";

const AdminProducts = () => {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    minOrderQuantity: "",
    unit: "",
    image: ""
  });

  const [stockModal, setStockModal] = useState(null);
  const [stockAmount, setStockAmount] = useState("");

  const[editModal, setEditModal] = useState(false);


  const fetchProducts = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);


  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const method = editingProduct ? "PUT" : "POST";
      const url = editingProduct ? `${API_URL}/${editingProduct._id}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      if (!res.ok) throw new Error("EL producto ya no existe o no se pudo actualizar");

      toast.success(`Producto ${editingProduct ? "actualizado" : "creado"}`);

      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        minOrderQuantity: "",
        unit: "",
        image: ""
      });

      setEditingProduct(null);
      setEditModal(false);
      fetchProducts();

    } catch (err) {
      toast.error("Error al guardar producto");
    }
  };

  //para editar producto mostrar formulario con datos del producto
  const handleEdit = (product) => {

    const exists = products.find(p => p._id === product._id);
    if (!exists) {
      toast.error("El producto ya no existe");
      fetchProducts();
      return;
    }

    setEditingProduct(product);
    setForm({
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      minOrderQuantity: product.minOrderQuantity || "",
      unit: product.unit || "",
      image: product.image || ""
    })
    setEditModal(true);
  };

  //Para eliminar un producto
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok){
      toast.error("Error al eliminar producto");  
      return;
    } 
    setProducts(prev => prev.filter(p => p._id !== id));
    toast.success("Producto eliminado");
    fetchProducts();
  };


  // Para cancelar edición o creación de producto
  const handleCancel = () => {
    setEditModal(false);
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      stock: "",
      category: "",
      minOrderQuantity: "",
      unit: "",
      image: ""
    });
  }

  return (
    <div className="admin-products">

      <h2 className="admin-title">Admin Productos</h2>

      {/* TOP BAR */}
      <div className="admin-topbar">

        <button
          className="btn primary"
          onClick={() => {
            setEditModal(true);
            setEditingProduct(null);
            setForm({
              name: "",
              price: "",
              stock: "",
              category: "",
              minOrderQuantity: "",
              unit: "",
              image: ""
            });
          }}
        >
          + Añadir producto
        </button>

        <input
          className="search-input"
          placeholder="Buscar producto..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* FORM */}
      {editModal && (
        <div className="modal-overlay">

          <div className="modal">

            <h3>{editingProduct ? "Editar producto" : "Crear producto"}</h3>

            <form onSubmit={handleSubmit} className="product-form">

              <input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
              <input name="price" value={form.price} onChange={handleChange} placeholder="Precio" />
              <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" />

              <select name="category" value={form.category} onChange={handleChange}>
                <option value="">Categoría</option>
                <option value="fruta">Fruta</option>
                <option value="verdura">Verdura</option>
                <option value="lácteo">Lácteo</option>
                <option value="cereal">Cereal</option>
                <option value="bebida">Bebida</option>
                <option value="panadería">Panadería</option>
                <option value="condimento">Condimento</option>
              </select>

              <select name="unit" value={form.unit} onChange={handleChange}>
                <option value="">Unidad</option>
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="caja">caja</option>
                <option value="unidad">unidad</option>
              </select>

              <input name="minOrderQuantity" value={form.minOrderQuantity} onChange={handleChange} placeholder="Pedido mínimo" />
              <input name="image" value={form.image} onChange={handleChange} placeholder="URL imagen" />

              <div className="form-actions">
                <button type="submit" className="btn primary">
                  {editingProduct ? "Actualizar" : "Crear"}
                </button>

                <button
                  type="button"
                  className="btn danger"
                  onClick={() => setEditModal(false)}
                >
                  Cancelar
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="table-wrapper">

        <table className="products-table">

          <thead>
            <tr>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Categoría</th>
              <th>Unidad</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}>

                <td>{product.name}</td>
                <td>{product.price}€</td>
                <td>{product.stock}</td>
                <td>{product.category}</td>
                <td>{product.unit}</td>

                <td className="actions">
                  <button onClick={() => handleEdit(product)}>✏️</button>
                  <button onClick={() => handleDelete(product._id)}>🗑</button>
                  <button onClick={() => setStockModal(product)}>➕</button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

      {/* STOCK MODAL */}
      {stockModal && (
        <div className="modal-overlay">

          <div className="modal">

            <h3>Añadir stock</h3>
            <p><strong>{stockModal.name}</strong></p>

            <input
              type="number"
              placeholder="Cantidad"
              value={stockAmount}
              onChange={(e) => setStockAmount(e.target.value)}
            />

            <div className="modal-actions">

              <button
                className="btn primary"
                onClick={async () => {
                  const newStock =
                    Number(stockModal.stock) + Number(stockAmount);

                  await fetch(`${API_URL}/${stockModal._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                      ...stockModal,
                      stock: newStock
                    })
                  });

                  toast.success("Stock actualizado");

                  setStockModal(null);
                  setStockAmount("");
                  fetchProducts();
                }}
              >
                Confirmar
              </button>

              <button className="btn danger" onClick={() => {
                setStockModal(null);
                setStockAmount("");
              }}>
                Cancelar
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default AdminProducts;