/* import { Router } from "express";
import passport from "passport";
import { UsersModel } from "../../dao/models/user.model.js";
import { createHash, tokenGenerator, validatePassword, authMiddleware, authorizationMiddleware } from "../../utils/index.js";

const router = Router();

// RUTA PRIVADA
router.get('/current', authMiddleware('jwt'), authorizationMiddleware('user'), (req, res) => {
    res.json({ success: true, message: 'This is the current user:', user: req.user })
})

// LOGIN DE USARIO
router.post('/login', async (req, res) => {
    const { body: { email, password } } = req
    const user = await UsersModel.findOne({ email })
    if(!user) {
        return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
    }
    if(!validatePassword(password, user)) {
        return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
    }
    const token = tokenGenerator(user)
    
    res.cookie('token', token, {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    }).status(200).json({ success: true})
})

// REGISTRO DE USARIO

router.post('/register', async (req, res) => {
    const { body: { first_name, last_name, email, age, password } } = req
    let user = await UsersModel.findOne({ email })
    if (user) {
        return res.status(400).json({ success: false, message: 'Email already exists.' })
    }
    user = await UsersModel.create({ first_name, last_name, email, age, password: createHash(password) })
    res.status(201).json({ success: true })
})

// SIGNOUT DE USARIO
router.post('/sign-out', (req, res) => {
    res.clearCookie('token').status(200).json({ success: true })
  })

// LOGIN POR GITHUB
router.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));


export default router; */