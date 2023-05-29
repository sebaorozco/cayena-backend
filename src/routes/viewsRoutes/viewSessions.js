import { Router } from "express";
import passport from "passport";
import { MessagesModel } from "../../dao/models/message.model.js";

const router = Router();

const auth = (req, res, next) => {
    if(req.session.user){
        return next();
    }
    res.status(401).json({ message: 'Acceso no autorizado' });
}

// REGISTRO DE USUARIO
router.get('/register', (req, res) => {
    res.render('register');

})

// LOGIN DE USUARIO
router.get('/login', (req, res) => {
    res.render('login')
})

// PERFIL DE USUARIO
router.get('/profile', auth, (req, res) => {
    res.render('profile', req.session.user)
})

// RESET CONTRASEÑA DE USUARIO
router.get('/reset-password', (req, res) => {
    res.render('reset-password')
})


// LOGIN POR GITHUB
router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

// CHAT CAYENA
router.get('/chat', async (req, res) => {
    try {
        const mensajes = await MessagesModel.find();
        res.status(201).render('chat', mensajes);   
    } catch (error) {
        res.json({ error: error.message });
    }
})

export default router;