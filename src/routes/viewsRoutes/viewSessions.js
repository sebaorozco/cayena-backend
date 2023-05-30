import { Router } from "express";
import passport from "passport";
import { MessagesModel } from "../../dao/models/message.model.js";
import __dirname from "../../utils.js";
import emailServices from "../../services/email.services.js";

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
    console.log('token', req.query.token);
    if(req.query.token){
        res.render('reset-password')
    } else {
        res.send(
            `
            <div>
                <h1>No puedes estar en este sitio. </h1>
            </div>
            `
        )
    }
})

// ENVÍO DE MAIL
router.get('/password', async (req, res) => {
    const attachments = [
        {
            filename: 'logoCayena.jpg',
            path: (__dirname + '/public/images/logoCayena/logoCayena.jpg'),
            cid: 'logoCayena'
        }
    ]
    const result = await emailServices.sendEmail(
        'seba_orozco@hotmail.com',
        'Reset Password',
        `
        <div>
            <h1>Reestablecer Contraseña. 🔑</h1>'
            <p>Haz clic en el siguiente enlace para reestablecer tu contraseña</p>
            <a href="http://localhost:8080/reset-password?token=${Date.now()}">Reestablecer Contraseña </a>
            <p>Saludos! 👋</p>
        </div>
        `,
        attachments
    )
    console.log(result);
    res.render('mail');
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