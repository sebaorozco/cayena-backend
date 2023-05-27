import homeController from '../controllers/controller.home.js';
import productsViewRoutes from './viewsRoutes/viewProducts.js';
import cartsViewRoutes from './viewsRoutes/viewCarts.js';
import chatApiRoutes from './apiRoutes/apiChat.js';
import productsApiRoutes from './apiRoutes/apiProducts.js';
import cartsApiRoutes from './apiRoutes/apiCarts.js';
import usersApiRoutes from './apiRoutes/apiUsers.js';

import sessionsViewRoutes from './viewsRoutes/viewSessions.js';
import sessionsApiRoutes from './apiRoutes/apiSessions.js';
import jwtApiRoutes from './apiRoutes/apiJWT.js';

const router = app => {
    // Rutas o endpoints
    app.use('/home', homeController);
    app.use('/chat', chatApiRoutes); 
    app.use('/api/carts', cartsApiRoutes);
    app.use('/api/products', productsApiRoutes);
    app.use('/api/users', usersApiRoutes);
    //app.use('/api', jwtApiRoutes);
    //app.use('/api/sessions', sessionsApiRoutes)
    //app.use('/', sessionsViewRoutes)
    app.use('/carts', cartsViewRoutes);
    app.use('/products', productsViewRoutes);
    //app.use('/private', jwtApiRoutes);
}

export default router;