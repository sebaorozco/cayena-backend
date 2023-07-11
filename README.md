# - Proyecto E-commerce Dietética Cayena - 

Este proyecto tiene como objetivo desarrollar el backend para un e-commerce de nombre **"Cayena - Almacén Orgánico & Natural"**.

Este es un servicio backend que permite el manejo de productos y carritos de compras. Este servicio permite crear, obtener, actualizar y eliminar.

Todo el proyecto fue desarrollado para el cursado de la carrera de Backend de la plataforma [Coderhouse](https://plataforma.coderhouse.com/cursos)

## Herramientas

El proyecto fue desarrollado utilizando lo siguiente:

- NodeJS.
- ExpressJS.
- Handlebars.
- Mongoose.
- bcrypt
- Passport
- JWT
- nodemailer
- Twilio
- Faker-js
- dotenv
- winston

## Módulos

- Configuración del servidor. 
- Enrutador.
- Modelos.
- DAO's.
- Controladores.
- Hasheo de contraseñas
- Autenticación y Autorización por JWT
- Diseño por Capas
- Patrón Factory, Patrón DTO
- Mailing y SMS
- Mocking
- Swagger
- Mocha
- Chai

## Rutas

El trabajo se ejecuta de manera local en el puerto 8080.
- /login muestra la vista de formulario de login de usuario. Si el usuario esta registrado podrá loguearse, caso contrario se muestra error de email no registrado.
- Para enviar un correo para reestablecer contraseña se debe hacer clic en el botón "Olvidé mi contraseña" que figura en esta ruta de login. Automáticamente se envía un mail a la casilla de correo del usuario, con un enlace a la ruta para reestablecer contraseña (/reset-password)
- /register muestra la vista de formulario de registro de usuario. Permite completar los campos para registrarse y almacena esos datos en la BD de nombre ecommerce (MongoDB).

- http://localhost:8080/api-docs/#/ es la ruta para ver la documentación de las API a través de Swagger.


## Postman Collection
En la raíz del proyecto encontrarán el archivo terceraPracticaIntegradora.postman_collection.json que les permitirá probar desde postman los endpoint del servicio.

## Ejecutar el proyecto
Para ejecutar el proyecto de manera local se puede hacer con:

```
$ npm run start
```

## Ejecutar test
Para ejecutar las pruebas de los modulos Products, Carts y Users se puede hacer con:

```
$ npm test
```