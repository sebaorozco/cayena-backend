import chatController from '../controllers/controller.chat.js';
import homeController from '../controllers/controller.home.js';
import productsViewRoutes from './viewsRoutes/viewProducts.js';
import cartsViewRoutes from './viewsRoutes/viewCarts.js';
import productsApiRoutes from './apiRoutes/apiProducts.js';
import cartsApiRoutes from './apiRoutes/apiCarts.js';

const router = app => {
    // Rutas o endpoints
    app.use('/', homeController);
    app.use('/chat', chatController); 
    app.use('/api/carts', cartsApiRoutes);
    app.use('/api/products', productsApiRoutes);
    app.use('/products', productsViewRoutes);
    app.use('/carts', cartsViewRoutes);

}

export default router;