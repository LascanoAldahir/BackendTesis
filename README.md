# Proyecto Veterinaria Backend
Frontend: https://github.com/4lanPz/AW_FRONTEND_VET_2023B

Este proyecto backend ha sido desarrollado utilizando
- Node.js 
- JSON Web Tokens (JWT)
- Nodemailer
- Thunderclient
- MongoDB
- JMeter

## Requisitos
- Node.js y npm instalados en tu sistema.
- Instancia de MongoDB en ejecución.
- npm install (inicializacion del proyecto)

## Estructura del Proyecto
controllers: Contiene los controladores que manejan la lógica de negocio.
models: Define los modelos de datos para la base de datos.
routes: Define las rutas de la API y utiliza los controladores correspondientes.
middlewares: Contiene middleware personalizado, como la protección de rutas con JWT.
config: Configuración de módulos extra como este caso nodemailer

## Modelos

En este proyecto se han ocupado 3 modelos Veterinario, Pacientes y Tratamientos.

Estos van a tener diferentes acciones en el uso de la API.

### - Veterinario
Realizar la creacion de pacientes y tratamientos de los pacientes.

### - Pacientes
Pueden revisar los tratamientos que ha creado el veterinario y nada más.

### - Tratamientos
Son los datos que crea el veterinario sobre el paciente, estos no realizan nada mas que contener información.

## Uso
Agregar variables en .env (guiarse en .env.example)

npm run dev (para ejecutar la api)

Accede a la API en http://localhost:3000

## Pruebas
### Thunderclient
Se utiliza Thunderclient para comprobar el funcionamiento de rutas privadas(por token) y públicas.

![Thunderclient](https://github.com/4lanPz/AW_BACKEND_VET_2023B/assets/117743495/e9e8b783-2d07-4187-b6cd-602bac169e1a)


### Apache JMeter
Se utiliza Apache JMeter para realizar pruebas de rendimiento.

![pruebas1](https://github.com/4lanPz/AW_BACKEND_VET_2023B/assets/117743495/0595037d-6daf-4977-8934-807ecbd9a3e6)

## Documentación
Archivo de documentación para revisión de todas las rutas, modelos, etc.

https://app.swaggerhub.com/apis/ALANSTVNALM/api-de_pacientes/1.0.0

https://app.swaggerhub.com/apis/ALANSTVNALM/api-de_veterinaria/1.0.0

## Deploy en Render
En este paso se debe agregar todas las variables y configuraciones necesarias del proyecto.

Para ello se ingresa las mismas variables del entorno local, si se va a pasar a producción utilizar el link de Frontend.

![render](https://github.com/4lanPz/AW_BACKEND_VET_2023B/assets/117743495/833195e0-e081-4d29-8241-529ba12772ca)
