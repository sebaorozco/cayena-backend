# Primera Práctica Integradora
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

## Módulos

- Configuración del servidor. 
- Enrutador.
- Modelos.
- DAO's.
- Controladores.

## Rutas

- El trabajo se ejecuta de manera local en el puerto 8080.
- /products muestra los productos cargados en la base de datos (Mongo DB) de nombre ecommerce. Colección "products"
- /carts muestra los carritos cargado en la base de datos (Mongo DB) de nombre ecommerce. Colección "carts".
- /chat se abre el chat en tiempo real utilizando websockets. Los mensajes se almacenan en la BD de MOngo de nombre ecommerce. Colección "messages"

## Postman Collection
En la raíz del proyecto encontrarán el archivo primeraPracticaIntegradora.json que les permitirá probar desde postman los endpoint del servicio.

## Ejecutar el proyecto en Producción
Para ejecutar el proyecto de manera local se puede hacer con:

```
$ npm run start
```
