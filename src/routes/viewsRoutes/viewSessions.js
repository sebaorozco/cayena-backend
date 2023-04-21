import { Router } from "express";

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

export default router;