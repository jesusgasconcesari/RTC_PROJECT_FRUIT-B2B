 #  Fruit B2B - Full Stack Web Application

##  Descripción

Este proyecto es una aplicación web full stack desarrollada como proyecto final del programa **Rock{TheCode}**. Se trata de una plataforma B2B para la gestión de una frutería, donde empresas pueden registrarse, comprar productos, gestionar pedidos y realizar seguimiento del estado de sus compras.

Incluye un sistema completo de administración para gestionar productos, usuarios y pedidos.

---

##  Objetivo del proyecto

El objetivo principal es simular una aplicación real de comercio B2B, aplicando una arquitectura full stack moderna con autenticación, gestión de roles y operaciones CRUD completas.

---

##  Stack tecnológico

### Frontend
- React
- Vite
- JavaScript
- CSS modular
- Context API
- React Router

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (autenticación)
- Bcrypt

---

##  Estructura del proyecto

El proyecto está dividido en dos carpetas principales:

/frontend_fruit-b2b → Aplicación cliente (React)
/backend_fruit-b2b → API REST (Node.js + Express + MongoDB)

---

##  Funcionalidades

###  Autenticación
- Registro de usuarios B2B
- Login con JWT
- Protección de rutas
- Roles: usuario / administrador

---

###  Usuario B2B
- Visualización de catálogo de productos
- Búsqueda y filtros
- Añadir productos al carrito
- Gestión del carrito (cantidades, eliminación)
- Realización de pedidos
- Seguimiento de pedidos
- Detalle de cada pedido

---

###  Panel de administración
- Gestión de productos (CRUD completo)
- Gestión de usuarios (CRUD completo)
- Gestión de pedidos:
  - Ver pedidos
  - Ver detalle
  - Cambiar estado del pedido

---

##  Arquitectura

- Frontend basado en componentes reutilizables + Context API
- Backend con arquitectura MVC (Models / Controllers / Routes)
- API REST para comunicación frontend-backend
- Autenticación con JWT
- Control de acceso basado en roles

---

##  Deploy

- Frontend: https://rtc-project-fruit-b2b.vercel.app/
- Backend: https://rtc-project-fruit-b2b.onrender.com

---
