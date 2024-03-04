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

### Locust

![WhatsApp Image 2024-03-04 at 10 34 05](https://github.com/4lanPz/AW_BACKEND_VET_2023B/assets/117743495/01dd1c7d-5856-4f2c-860a-bd5cc27d1357)

![WhatsApp Image 2024-03-04 at 10 41 12](https://github.com/4lanPz/AW_BACKEND_VET_2023B/assets/117743495/263640e2-778f-4371-87dd-4f0f06f07b51)

![WhatsApp Image 2024-03-04 at 10 42 11](https://github.com/4lanPz/AW_BACKEND_VET_2023B/assets/117743495/c26873d0-ef41-472c-88d1-be36482c9f37)

Cypress

![WhatsApp Image 2024-03-04 at 13 05 53](https://github.com/4lanPz/AW_BACKEND_VET_2023B/assets/117743495/2337c1f4-7f8c-4699-a2c5-57bc893ef032)

## Documentación
Archivo de documentación para revisión de todas las rutas, modelos, etc.

https://app.swaggerhub.com/apis/ALANSTVNALM/api-de_pacientes/1.0.0

https://app.swaggerhub.com/apis/ALANSTVNALM/api-de_veterinaria/1.0.0

## Deploy en Render
En este paso se debe agregar todas las variables y configuraciones necesarias del proyecto.

Para ello se ingresa las mismas variables del entorno local, si se va a pasar a producción utilizar el link de Frontend.

![render](https://github.com/4lanPz/AW_BACKEND_VET_2023B/assets/117743495/833195e0-e081-4d29-8241-529ba12772ca)
