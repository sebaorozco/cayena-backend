import homeController from '../controllers/controller.home.js';
import productsViewRoutes from './viewsRoutes/viewProducts.js';
import cartsViewRoutes from './viewsRoutes/viewCarts.js';
import sessionsViewRoutes from './viewsRoutes/viewSessions.js';
import contactViewRoutes from './viewsRoutes/viewContacts.js';
import chatApiRoutes from './apiRoutes/apiChat.js';
import productsApiRoutes from './apiRoutes/apiProducts.js';
import cartsApiRoutes from './apiRoutes/apiCarts.js';
import usersApiRoutes from './apiRoutes/apiUsers.js';
import mockingProducts from '../mocking/mockingRoutes/apiMockingProducts.js';
import loggerApiRoutes from './apiRoutes/apiLoggerTest.js'

const router = app => {
    // Rutas o endpoints
    app.use('/home', homeController);
    app.use('/api/chat', chatApiRoutes); 
    app.use('/api/carts', cartsApiRoutes);
    app.use('/api/products', productsApiRoutes);
    app.use('/api/users', usersApiRoutes);
    app.use('/', sessionsViewRoutes);
    app.use('/carts', cartsViewRoutes);
    app.use('/products', productsViewRoutes);
    app.use('/contact', contactViewRoutes)
    
    // Mocking Endpoint
    app.use('/api/mockingproducts', mockingProducts);
    // Winston Test Logs
    app.use('/api/loggerTest', loggerApiRoutes)

}

export default router;