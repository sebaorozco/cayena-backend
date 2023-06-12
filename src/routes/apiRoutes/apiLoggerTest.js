import { Router } from "express";
import { createUser, getCurrentUser, getUsers, loginUser, logoutUser, resetPassword } from "../../controllers/controller.users.js";
import { authMiddleware, authorizationMiddleware } from "../../utils/index.js";

const router = Router();

//Login de usuario
router.post('/login', loginUser);

//Registro
router.post('/register', createUser);

// OBTENER USUARIOS
router.get('/', getUsers);

//Logout
router.get('/logout', logoutUser);

//Current
router.get('/current', authMiddleware('jwt'), authorizationMiddleware('user'), getCurrentUser);

// Reset Password
router.post('/reset-password', resetPassword);

export default router;