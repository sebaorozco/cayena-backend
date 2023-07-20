import { Router } from "express";
import { addCartToUser, changeUserRole, createUser, deleteUserByEmail, getCurrentUser, getUsers, loginUser, logoutUser, resetPassword } from "../../controllers/controller.users.js";
import passport from "passport";
import { authMiddleware, authorizationMiddleware } from "../../utils/index.js";


const router = Router();

// REGISTRO DE USARIO
router.post('/register', createUser)

// OBTENER USUARIOS
router.get('/', getUsers);

// ELIMINAR USUARIOS
router.delete('/delete', deleteUserByEmail);

// AGREGA UN CARRITO A UN USER ESPECÍFICO 
router.put('/:email', addCartToUser); 

// LOGIN USER
router.post('/login', loginUser);

// LOGOUT USER
router.post('/logout', authMiddleware('jwt'), logoutUser);

//RESET PASSWORD
router.post('/reset-password', authMiddleware('jwt'), authorizationMiddleware('user'), resetPassword);

// RUTA PRIVADA
router.get('/current', authMiddleware('jwt'), authorizationMiddleware('user'), getCurrentUser)

// MODIFICAR ROL DE USUARIO
router.get('/premium/:uid', authMiddleware('jwt'), authorizationMiddleware('admin'), changeUserRole);

// RUTA PARA SUBIR DOCUMENTOS
router.post('/uid/documents', authMiddleware('jwt'), authorizationMiddleware('admin', 'user', 'premium'), uploadDocuments);

// LOGIN POR GITHUB
router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));


export default router;