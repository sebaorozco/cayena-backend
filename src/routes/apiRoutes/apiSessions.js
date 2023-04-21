import { Router } from "express";
import UserManagerDAO from "../../dao/mongoManagers/UserManagerDAO.js";
import { UsersModel } from "../../dao/models/user.model.js";

const router = Router();

// REGISTRO DE USUARIO
router.post('/register', async (req, res) => {

    const {first_name, last_name, email, age, password} = req.body;
      
    if(!first_name || !last_name || !email || !age || !password){
        return res.status(400).render('register', { message: 'Debe completar todos los campos!'})
    }

    try {
        const userInfo = {
            first_name,
            last_name,
            email,
            age,
            password
        }
        const newUser = await UserManagerDAO.createUser(userInfo);
        res.status(201).redirect('/login');   
    } catch (error) {
        res.status(400).render('register', { message: 'El correo ya existe.', metadata: error });
    }
 
})

// LOGIN DE USUARIO
router.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const userInfo = {
            email,
            password
        }
        
        if(!email || !password){
            return res.render('login', { error: 'Debe completar todos los campos!'})
        }
        const newUser = await UsersModel.findOne( email );
        
        if(!newUser){
            res.render('login', { message: 'Email o password inválido', metadata: error });
        }

        if(newUser.password !== password){
            res.render('login', { message: 'Email o password inválido', metadata: error });
        }
        
        req.session.user = newUser;
        
        if (newUser.email === 'adminCoder@coder.com' && newUser.password === 'adminCod3r123') {
            newUser.role = 'admin'
            await newUser.save()
        }
        
        res.status(200).redirect('/profile');
        
    } catch (error) {
        res.status(400).json({ message: 'Email o password inválido', metadata: error });
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

export default router;