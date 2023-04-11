import productsController from '../controllers/controller.products.js';
import chatController from '../controllers/controller.chat.js';
import cartsController from '../controllers/controller.carts.js';
import homeController from '../controllers/controller.home.js';
import productsRouter from './fs/products.routes.js';
import cartsRouter from './fs/carts.routes.js';

const router = app => {
    // Vamos a crear las rutas de nuestros endpoints usando FS
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);

    // Creo las rutas a nuestras vistas por HBS
    app.use('/', homeController);
    app.use('/chat', chatController); 
    
    // Creo las rutas a nuestras API's
    app.use('/products', productsController);
    app.use('/carts', cartsController)
}


export default router;