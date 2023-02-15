// Importar nuestras dependencias
import express from 'express';
import productsRouter from './routes/products.routes.js'

// Instanciar constantes
const app = express();

/* // Instanciar las constantes de nuestras rutas
const routerProducts = express.Router();
const routerCarts = express.Router();*/

// Vamos a crear las rutas de nuestros endpoints
app.use('/api/products', productsRouter);
//app.use('/api/carts', routerCarts);

app.use(express.json());
app.use(express.urlencoded({extended: true}));



// Configurar nuestro servidor
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${server.address().port}`);
})
server.on('error', error => console.log('Error en el servidor: ', error));