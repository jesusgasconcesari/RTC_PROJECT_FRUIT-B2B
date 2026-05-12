# 📦 Backend - Frutería B2B API

## 📖 Descripción

Este es el backend de una aplicación web B2B para la gestión de una frutería. Permite la administración de usuarios empresariales, productos y pedidos, con control de roles y autenticación segura mediante JWT.

La API está construida siguiendo una arquitectura REST y permite la gestión completa del negocio: catálogo de productos, pedidos de clientes y administración de usuarios.

---

## 🧰 Tecnologías utilizadas

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Token)
- Bcrypt (para encriptación de contraseñas)

---

## 🏗️ Arquitectura del proyecto

El proyecto sigue una estructura modular basada en:

- **Models** → Esquemas de base de datos (MongoDB)
- **Controllers** → Lógica de negocio
- **Routes** → Definición de endpoints
- **Middlewares** → Autenticación y control de roles (`isAuth`, `isAdmin`)

---

## 📊 Modelos de datos

### 👤 User
- name
- email
- password
- role
- businessName
- CIF
- address
- timestamps

---

### 🍎 Product
- name
- price
- category
- stock
- isSeasonal
- minOrderQuantity
- image
- unit
- timestamps

---

### 📦 Order
- user (referencia)
- products:
  - product
  - quantity
  - price
- totalPrice
- status
- timestamps

---

## 🔐 Autenticación y roles

El sistema utiliza JWT para la autenticación.

### Middlewares:
- `isAuth` → Verifica que el usuario esté autenticado
- `isAdmin` → Permite acceso solo a administradores

### Roles:
- Admin
- Usuario B2B

---

## 📡 Endpoints principales

### 🔐 Auth
- `POST /auth/register` → Registro de usuario
- `POST /auth/login` → Login

---

### 👤 Users 
- `GET /admin/users` → Obtener todos los usuarios
- `GET /admin/users/:id` → Obtener usuario por ID
- `PUT /admin/users/:id` → Actualizar usuario
- `DELETE /admin/users/:id` → Eliminar usuario

---

### 🍎 Products
- `GET /products` → Obtener todos los productos
- `GET /products/:id` → Obtener producto por ID
- `POST /admin/products` → Crear producto 
- `PUT /admin/products/:id` → Actualizar producto 
- `DELETE /admin/products/:id` → Eliminar producto 

---

### 📦 Orders
- `POST /orders` → Crear pedido
- `GET /orders/my-orders` → Obtener pedidos del usuario
- `GET /admin/orders` → Obtener todos los pedidos 
- `GET /orders/:id` → Obtener pedido por ID
- `PUT /admin/orders/:id/status` → Actualizar estado del pedido 

---

## ⚙️ Instalación y ejecución

```bash
npm install
npm run dev