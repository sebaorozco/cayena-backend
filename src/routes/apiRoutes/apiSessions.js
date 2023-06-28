import { Router } from "express";
import { UsersModel } from "../../dao/models/user.model.js";
import passport from "passport";
import { createHash, isValidToken, tokenGenerator, validatePassword } from "../../utils/index.js";
import emailServices from "../../services/email.services.js";
import __dirname from "../../utils.js";
import { UserManagerDAO } from "../../dao/factory.js";


const router = Router();

// REGISTRO DE USUARIO
router.post('/register', passport.authenticate('register', { failureRedirect: '/register'}), (req, res) => {
    res.redirect('/login');
})

// LOGIN DE USUARIO
router.post('/login', async (req, res, next) => {
    try {
        const { body: { email, password } } = req
        const user = await UserManagerDAO.getUserByEmail({ email })
        if(!user) {
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            return res.render('login', { error: 'Email o password incorrect!'})  
        }
        if(!validatePassword(password, user)) {
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            return res.render('login', { error: 'Email o password incorrect!'})  
        }
        
        const token = tokenGenerator(user)
        req.logger.info(` ${req.method} en ${req.url} - ${user} `)
        
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).redirect(`/profile?token=${token}`);
        
        
    } catch (error) {
        next(error);
    }
})


// LOGOUT DE USUARIO
router.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (!error) {
            res.redirect('/login')
        } else {
            res.send({status: 'Logout Error', body: error })
        }
    })
})

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    const { body: { email } } = req

    if(!email){
        return res.render('reset-password', { error: 'Debe completar con su correo!'})
    }
    
    const newUser = await UsersModel.findOne({ email });
    
    if(!newUser){
        return res.render('reset-password', { error: 'Email inexistente' });
    }

    const token = tokenGenerator(newUser, '1h');

    console.log('token', token);

    const attachments = [
        {
            filename: 'logoCayena.jpg',
            path: (__dirname + '/public/images/logoCayena/logoCayena.jpg'),
            cid: 'logoCayena'
        }
    ]
    const result = await emailServices.sendEmail(
        email,
        'Reset Password',
        `
        <div>
            <h1>Reestablecer Contraseña. 🔑</h1>'
            <p>Haz clic en el siguiente enlace para reestablecer tu contraseña</p>
            <a href="http://localhost:8080/change-password?token=${token}">Reestablecer Contraseña </a>
            <p>Saludos! 👋</p>
        </div>
        `,
        attachments
    )
    res.render('mail');
})

router.post('/change-password', async (req, res) =>{
    const { 
        query: { token },
        body: {newPassword, repeatNewPassword} 
    } = req;

    if (newPassword !== repeatNewPassword){
        return res.render('change-password', { error: 'Las contraseñas no coiniciden!' });
    }

    if (!token){
        return res.render('change-password', { error: 'Token inexistente' });
    }

    const payload = await isValidToken(token);
    if (!payload){
        return res.render('change-password', { error: 'Token no es válido' });
    }
    const { id } = payload;

    const user = await UsersModel.findById(id);

    if (!user){
        return res.render('change-password', { error: 'Usuario inexistente' });
    }

    if (validatePassword(newPassword, user)){
        return res.render('change-password', { error: 'No puede utilizar una contraseña anterior' })
    }

    user.password = createHash(newPassword);

    await UsersModel.updateOne({ _id: id }, user);

    res.redirect('/login');

})

// LOGIN POR GITHUB
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
    // Successful authentication, redirect profile.
    console.log('req.user', req.user);
    req.session.user = req.user;
    res.redirect('/profile');
});



export default router;