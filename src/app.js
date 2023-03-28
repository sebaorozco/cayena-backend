// Importar nuestras dependencias
import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { engine } from 'express-handlebars';
import __dirname from './utils.js';
import ProductManager from './dao/fsManagers/ProductManager.js';
import { Server } from 'socket.io';
import { init } from './db/mongodb.js';
import routerIndex from './routes/products.router.js'
import cartRouterIndex from './routes/carts.router.js'
import chatRouterIndex from './routes/messages.router.js'


init();

// Instanciar constantes
const app = express();
const product = new ProductManager;
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
    console.log("Running on", PORT)
});  //Server Http

// Creamos el servidor para sockets viviendo dentro de nuestro servidor principal
const socketServer = new Server(httpServer);    //socketServer será un servidor para trabajar con sockets */

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ***** Configuración de Handlebars ********** //
// Inicializamos el motor
app.engine('handlebars', engine())

// Luego indicamos que el motor ya inicializado arriba es el que queremos utilizar 
app.set('view engine', 'handlebars');

// Indicamos en qué parte del proyecto estarán las vistas
app.set('views', __dirname + '/views');

// Tenemos que definir las rutas estáticas de nuestras vistas
app.use("/", express.static(__dirname + '/public'));

// Enviamos la lista de todos los productos usando Handlebars
app.get("/", async (req, res) => {
    let allProducts = await product.getProducts();
    res.render("home", {
        title: "Cayena - Almacén Orgánico y Natural",
        products: allProducts
    })
}) 

// Enviamos la lista de todos los productos usando WEBSOCKETS
app.get('/realtimeproducts', async (req, res) => {
    let products = await product.getProducts();
    const scripts = { socket: '/socket.io/socket.io.js', index: '/js/index.js', products }
    res.render('realTimeProducts', scripts);
})

// Vamos a crear las rutas de nuestros endpoints
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', routerIndex);
app.use('/', cartRouterIndex);
app.use('/', chatRouterIndex);

// Escuchar conexion de un nuevo cliente

socketServer.on('connection', async (socketClient) => {
    console.log("Nuevo cliente conectado", socketClient.id);
    socketClient.emit('inicio', "Hola desde Websockets!");

    socketClient.on('disconnect', () => {
        console.log("Usuario desconectado");
    })
});