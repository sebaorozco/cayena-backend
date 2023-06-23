import { Router } from "express";
import { UsersModel } from "../../dao/models/user.model.js";
import passport from "passport";
import { createHash, validatePassword } from "../../utils/index.js";

const router = Router();

// REGISTRO DE USUARIO
router.post('/register', passport.authenticate('register', { failureRedirect: '/register'}), (req, res) => {
    res.redirect('/login');
})

// LOGIN DE USUARIO
router.post('/login', passport.authenticate('login', { failureRedirect: '/login'}), (req, res) => {
    req.session.user = req.user;
    res.redirect('/profile');
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
    const {email, password} = req.body;

    if(!email || !password){
        return res.render('reset-password', { error: 'Debe completar todos los campos!'})
    }
    
    const newUser = await UsersModel.findOne({ email });
    
    if(!newUser){
        return res.render('reset-password', { error: 'Email o password inválido' });
    }

    newUser.password = createHash(password);

    await UsersModel.updateOne({ email }, newUser);
    
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