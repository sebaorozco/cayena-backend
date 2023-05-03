import chatController from '../controllers/controller.chat.js';
import homeController from '../controllers/controller.home.js';
import productsViewRoutes from './viewsRoutes/viewProducts.js';
import cartsViewRoutes from './viewsRoutes/viewCarts.js';
import productsApiRoutes from './apiRoutes/apiProducts.js';
import cartsApiRoutes from './apiRoutes/apiCarts.js';
import usersApiRoutes from './apiRoutes/apiUsers.js';
import sessionsApiRoutes from './apiRoutes/apiSessions.js';
import sessionsViewRoutes from './viewsRoutes/viewSessions.js';
import jwtViewRoutes from './apiRoutes/apiJWT.js';

const router = app => {
    // Rutas o endpoints
    app.use('/home', homeController);
    app.use('/api/carts', cartsApiRoutes);
    app.use('/api/products', productsApiRoutes);
    app.use('/api/sessions', sessionsApiRoutes)
    app.use('/api/users', usersApiRoutes)
    app.use('/api', jwtViewRoutes);
    app.use('/carts', cartsViewRoutes);
    app.use('/products', productsViewRoutes);
    app.use('/', sessionsViewRoutes)
    app.use('/chat', chatController); 
    app.use('/private', jwtViewRoutes);
}

export default router;