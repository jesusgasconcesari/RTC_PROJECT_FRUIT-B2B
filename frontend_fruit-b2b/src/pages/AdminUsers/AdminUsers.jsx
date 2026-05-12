// src/pages/AdminUsers/AdminUsers.jsx

import { useEffect, useState, useContext, useMemo } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import "./AdminUsers.css";

const API_URL = "/api/users";

const AdminUsers = () => {
  const { token, user: currentUser } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

    
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState({
        name: "",
        email: "",
        businessName: "",
        CIF: "",
        address: ""
    });
  
  


  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      toast.error("Error al cargar usuarios");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const text = search.toLowerCase();

    return users.filter((user) =>
      user.name.toLowerCase().includes(text) ||
      user.email.toLowerCase().includes(text) ||
      user.businessName.toLowerCase().includes(text)
    );
  }, [users, search]);

  const changeRole = async (userId, newRole) => {
    if (currentUser._id === userId) {
      toast.error("No puedes cambiar tu propio rol");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          role: newRole
        })
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Rol actualizado");
      fetchUsers();

    } catch (err) {
      console.error(err);
      toast.error("Error al actualizar rol");
    }
  };

  const deleteUser = async (userId) => {

    if (currentUser._id === userId) {
      toast.error("No puedes eliminarte a ti mismo");
      return;
    }

    const confirm = await Swal.fire({
      title: "¿Eliminar usuario?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d32f2f"
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error();
      }

      toast.success("Usuario eliminado");
      fetchUsers();

    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar usuario");
    }
  };
  const handleEdit = (user) => {
    setEditingUser(user);

    setForm({
        name: user.name || "",
        email: user.email || "",
        businessName: user.businessName || "",
        CIF: user.CIF || "",
        address: user.address || ""
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const res = await fetch(`${API_URL}/${editingUser._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
        });

        if (!res.ok) throw new Error();

        toast.success("Usuario actualizado");

        setEditingUser(null);
        fetchUsers();

    } catch (err) {
        console.error(err);
        toast.error("Error al actualizar usuario");
    }
  };



  return (
    <div className="admin-users-page">

      <h2 className="admin-users-title">
        Panel Admin - Usuarios
      </h2>

      <div className="users-filters">

        <input
          type="text"
          placeholder="Buscar por empresa, nombre o email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {filteredUsers.length === 0 ? (
        <p>No se encontraron usuarios</p>
      ) : (
        filteredUsers.map((user) => (

          <div key={user._id} className="user-card">

            <div className="user-info">
              <strong>{user.businessName}</strong>
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{user.address}</p>
            </div>

            <div className="user-role">

              <span className={`role-badge ${user.role}`}>
                {user.role}
              </span>

            </div>

            <div className="user-actions">

              <button
                onClick={() =>
                  changeRole(
                    user._id,
                    user.role === "admin"
                      ? "client"
                      : "admin"
                  )
                }
              >
                {user.role === "admin"
                  ? "Quitar admin"
                  : "Hacer admin"}
              </button>
                    
              <button onClick={() => handleEdit(user)}>
                ✏️ Editar
                </button>

              <button
                className="danger"
                onClick={() => deleteUser(user._id)}
              >
                Eliminar
              </button>

            </div>

          </div>

        ))
      )}

        {editingUser && (
            <div className="modal-overlay">

                <div className="modal">

                <h3>Editar usuario</h3>

                <form onSubmit={handleSubmit}>

                    <input
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Nombre"
                    />

                    <input
                    value={form.email}
                    onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                    }
                    placeholder="Email"
                    />

                    <input
                    value={form.businessName}
                    onChange={(e) =>
                        setForm({ ...form, businessName: e.target.value })
                    }
                    placeholder="Empresa"
                    />

                    <input
                    value={form.CIF}
                    onChange={(e) =>
                        setForm({ ...form, CIF: e.target.value })
                    }
                    placeholder="CIF"
                    />

                    <input
                    value={form.address}
                    onChange={(e) =>
                        setForm({ ...form, address: e.target.value })
                    }
                    placeholder="Dirección"
                    />

                    <div className="modal-actions">

                    <button type="submit">
                        Guardar
                    </button>

                    <button
                        type="button"
                        onClick={() => setEditingUser(null)}
                    >
                        Cancelar
                    </button>

                    </div>

                </form>

                </div>

            </div>
            )}
    </div>
  );
};

export default AdminUsers;