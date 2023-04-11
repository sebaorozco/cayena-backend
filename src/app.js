// Importar nuestras dependencias
import express from 'express';
import { engine } from 'express-handlebars';
import __dirname from './utils.js';
import { Server } from 'socket.io';
import { dbConnect } from './db/mongodb.js';
import router from './routes/index.js';
import { MessagesModel } from './dao/models/message.model.js';

// Instanciar constantes
//const messages = [];
const app = express();
const PORT = 8080;

app.use(express.json());
app.use(express.urlencoded({extended: true}));


// ****** Configuración de Handlebars ********** //
// Inicializamos el motor
app.engine('handlebars', engine())

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
    console.log(`Server running at port: ${PORT}`);
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
        //console.log(data)
        //messages.push(data);
        io.emit('messageLogs', mensaje)
      })
})

export const emit = (mensaje) => {
    io.emit('messageLogs', mensaje)
  }
/*
*************** Para saber: ***************
express     =>  http        => API's
socket.io   =>  websockets  => real time 
*/