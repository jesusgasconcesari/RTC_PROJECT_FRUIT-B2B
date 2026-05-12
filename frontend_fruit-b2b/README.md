# 🥬 Frutería B2B - Frontend

## 📖 Descripción

Este es el frontend de una aplicación web B2B para la gestión de una frutería. Permite a los usuarios empresariales navegar por un catálogo de productos, gestionar un carrito de compra y realizar pedidos. También incluye un panel de administración para la gestión de productos, usuarios y pedidos.

La aplicación está diseñada con enfoque B2B, interfaz responsive y control de acceso por roles (usuario / admin).

---

## 🧰 Tecnologías utilizadas

- React
- Vite
- JavaScript (ES6+)
- CSS
- React Router
- Context API (gestión de estado)


---

## 📁 Estructura del proyecto

```bash
src/
│
├── api/          # Llamadas a la API (Axios)
├── components/   # Componentes reutilizables
├── pages/        # Páginas de la aplicación
├── context/      # Estado global (auth, carrito, etc.)
├── routes/       # Rutas protegidas y configuración de navegación
├── styles/       # Estilos globales
│
├── App.jsx
└── main.jsx