// Importar nuestras dependencias
import express from 'express';
import productsRouter from './router/products.routes.js';
import cartsRouter from './router/carts.routes.js';

// Instanciar constantes
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Vamos a crear las rutas de nuestros endpoints
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configurar nuestro servidor
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${server.address().port}`);
})
server.on('error', error => console.log('Error en el servidor: ', error));