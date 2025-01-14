# **Sistema Integral de Soporte Técnico y Atención al Cliente para Taller de Electrónica**

## 📖 **Descripción**
Este proyecto consiste en el desarrollo del backend para un sistema que facilita la gestión de revisiones y reparaciones electrónicas en **“Electrónica Zurita”**. Fue diseñado para cumplir con los requisitos específicos del negocio, brindando soporte a:  
- **Técnicos:** Registrar servicios, generar proformas y gestionar información de clientes.  
- **Clientes:** Consultar el estado de sus reparaciones y recibir notificaciones en tiempo real a través de una aplicación móvil.

El backend está construido utilizando tecnologías modernas como **Node.js**, **Express.js** y **MongoDB**, y está alojado en **Render**, garantizando su disponibilidad y escalabilidad.

---

## 🚀 **Características Principales**
- **API RESTful segura:** Endpoints protegidos con **JWT** para diferentes roles (técnico y cliente).  
- **Gestión de datos robusta:** Operaciones CRUD para clientes, equipos y reparaciones.  
- **Proformas dinámicas:** Generación y envío de proformas.  
- **Notificaciones en tiempo real:** (Opcional si hay integración futura).  
- **Alojado en Render:** Alta disponibilidad y escalabilidad.  

---

## 🛠️ **Tecnologías Utilizadas**
- **Node.js:** Plataforma para ejecutar JavaScript en el servidor.  
- **Express.js:** Framework para crear una API REST eficiente.  
- **MongoDB:** Base de datos NoSQL para almacenar datos relacionados con clientes, equipos y reparaciones.  
- **JWT (JSON Web Tokens):** Autenticación y autorización de usuarios.  
- **Scrum:** Metodología ágil para el desarrollo del proyecto.  
- **Render:** Servicio de hosting para el backend.  

---

## 📂 **Estructura del Proyecto**
```bash
/src
  ├── controllers/       # Controladores de las operaciones del sistema
  ├── models/            # Modelos de datos para MongoDB
  ├── routes/            # Rutas de los endpoints
  ├── utils/             # Utilidades como validadores y middlewares
  ├── app.js             # Configuración principal del servidor
.env                     # Variables de entorno
README.md                # Este archivo