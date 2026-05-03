import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import "./AdminProducts.css";

const API_URL = "/api/products";

const AdminProducts = () => {
  const { token } = useContext(AuthContext);

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    minOrderQuantity: "",
    unit: ""
  });

  const [stockModal, setStockModal] = useState(null);
  const [stockAmount, setStockAmount] = useState("");


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

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      toast.success(`Producto ${editingProduct ? "actualizado" : "creado"}`);

      setForm({
        name: "",
        price: "",
        stock: "",
        category: "",
        minOrderQuantity: "",
        unit: ""
      });

      setEditingProduct(null);
      setShowForm(false);
      fetchProducts();

    } catch (err) {
      toast.error("Error al guardar producto");
    }
  };

  //para editar producto mostrar formulario con datos del producto
  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setForm(product);
  };

  //Para eliminar un producto
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      showCancelButton: true
    });

    if (!confirm.isConfirmed) return;

    await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    toast.success("Producto eliminado");
    fetchProducts();
  };


  // Para cancelar edición o creación de producto
  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setForm({
      name: "",
      price: "",
      stock: "",
      category: "",
      minOrderQuantity: "",
      unit: ""
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
            setShowForm(true);
            setEditingProduct(null);
            setForm({
              name: "",
              price: "",
              stock: "",
              category: "",
              minOrderQuantity: "",
              unit: ""
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
      {showForm && (
        <form className="product-form" onSubmit={handleSubmit}>

          <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} />
          <input name="price" placeholder="Precio" value={form.price} onChange={handleChange} />
          <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
          <input name="category" placeholder="Categoría" value={form.category} onChange={handleChange} />
          <input name="minOrderQuantity" placeholder="Pedido mínimo" value={form.minOrderQuantity} onChange={handleChange} />

          <select name="unit" value={form.unit} onChange={handleChange}>
            <option value="">Unidad</option>
            <option value="kg">kg</option>
            <option value="g">g</option>
            <option value="l">l</option>
            <option value="ml">ml</option>
            <option value="caja">caja</option>
            <option value="unidad">unidad</option>
          </select>

          <div className="form-actions">
            <button type="submit" className="btn primary">
              {editingProduct ? "Actualizar" : "Crear"}
            </button>

            <button type="button" className="btn danger" onClick={handleCancel}>
              Cancelar
            </button>
          </div>

        </form>
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