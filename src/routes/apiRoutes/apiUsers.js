import { Router } from "express";
import { addCartToUser, createUser, deleteUserByEmail, getUsers, loginUser, logoutUser, resetPassword } from "../../controllers/controller.users.js";
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
router.post('/logout', logoutUser);

//RESET PASSWORD
router.post('reset-password', resetPassword);

// RUTA PRIVADA
router.get('/current', authMiddleware('jwt'), authorizationMiddleware('user'), (req, res) => {
    res.json({ success: true, message: 'This is the current user:', user: req.user })
})

export default router;