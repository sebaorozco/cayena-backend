import { Router } from "express";
//import { createUser, getCurrentUser, getUsers, loginUser, logoutUser, resetPassword } from "../../controllers/controller.users.js";
//import { authMiddleware, authorizationMiddleware } from "../../utils/index.js";

const router = Router();
/*
//Login de usuario
router.post('/', loginUser);

//Registro
router.post('/register', createUser);

// OBTENER USUARIOS
router.get('/', getUsers);

//Logout
router.get('/logout', logoutUser);

//Current
router.get('/current', authMiddleware('jwt'), authorizationMiddleware('user'), getCurrentUser);

// Reset Password
router.post('/reset-password', resetPassword); */

router.get('/', (req, res) => {
    req.logger.fatal('Esto fue un fatal');
    //req.logger.error('Esto fue un error');
    req.logger.warning('Esto fue un warn');
    req.logger.info('Esto fue un info');
    req.logger.http('Esto fue un http');
    req.logger.debug('Esto fue un debug');
    res.send('<h1>Hello! This is a Logger Test page!</h1>');
})

export default router;