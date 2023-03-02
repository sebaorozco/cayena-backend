// Importar nuestras dependencias
import express from 'express';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import { engine } from 'express-handlebars';
import __dirname from './utils.js';
import ProductManager from './components/ProductManager.js';

// Instanciar constantes
const app = express();
const product = new ProductManager;

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

// Vamos a crear las rutas de nuestros endpoints
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Configurar nuestro servidor
const PORT = 8080;
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto: ${server.address().port}`);
})
server.on('error', error => console.log('Error en el servidor: ', error));