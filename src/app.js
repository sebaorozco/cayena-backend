// Importar nuestras dependencias
import config from './config/index.js';
import express from 'express';
import { engine } from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import { dbConnect } from './db/mongodb.js';
import router from './routes/index.js';
import { MessagesModel } from './dao/models/message.model.js';
//import ProductManager from './dao/fsManagers/ProductManager.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import initPassport from './config/passport.config.js';
import passport from 'passport';
import cookieParser from 'cookie-parser';

// Instanciar constantes
const PORT = config.port;
const app = express();
//const product = new ProductManager;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Inicializo Passport - Estrategia de Autenticación
initPassport();

app.use(passport.initialize());
//app.use(passport.session());


// ****** Configuración de Handlebars ********** //
// Inicializamos el motor
app.engine('handlebars', engine({runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  }})
)

// Luego indicamos que el motor ya inicializado arriba es el que queremos utilizar 
app.set('view engine', 'handlebars');

// Indicamos en qué parte del proyecto estarán las vistas
app.set('views', __dirname + '/views');

// ***** Tenemos que definir las rutas estáticas de nuestras vistas ********//
app.use("/", express.static(__dirname + '/public'));

// *******Llamo al enrutador*******************//
router(app);

// Me conecto a la BD
dbConnect();

// Creo el servidor HTTP
const httpServer = app.listen(PORT, () => {
    console.log(`Server running in: http://localhost:${PORT}/`);
});  //Server Http

// Creamos el servidor para sockets viviendo dentro de nuestro servidor principal
const io = new Server(httpServer);    //io será un servidor para trabajar con sockets */

io.on('connection', socket => {
    console.log(`Cliente conectado con id: ${socket.id}`);
    
    socket.on('newUser', async user => {
        const arrayHistorial = await MessagesModel.find();
        arrayHistorial.forEach(element => {
            socket.emit('messageLogs', element); 
        });
        socket.broadcast.emit('userConnected', user);
    })

    socket.on('message', async (data) => {
        const mensaje = await MessagesModel.create(data);
        io.emit('messageLogs', mensaje)
    })

   /*  socket.on('newProduct', async (data) => {
        await product.addProducts(data);
        const allProducts = await product.getProducts();
        socket.emit('productsLog', allProducts);
    }) */
})

export const emit = (mensaje) => {
    io.emit('messageLogs', mensaje)
}

app.use((err, req, res, next) => {
    console.error('Error Middleware', err)
    res 
      .status(err.status || 500)
      .json({ success: false, message: err.message })
})



/*
*************** Para saber: ***************
express     =>  http        => API's
socket.io   =>  websockets  => real time 
*/