import { UserManagerDAO } from "../dao/factory.js"
import UserDTO from "../dto/UsersDTO.js";
import Exception from "../utils/exception.js";
import { createHash, tokenGenerator, validatePassword, authMiddleware, authorizationMiddleware } from "../utils/index.js";


export const getUsers = async (req, res, next) => {
    try {
        let result = await UserManagerDAO.getUsers();
        if(!result) {
            req.logger.fatal(` ${req.method} en ${req.url} - Something went wrong. Try again later.`);
            throw new Exception('Something went wrong. Try again later.', 500);
            //return res.status(500).send({ status: 'error', error: 'Something went wrong. Try again later.' })
        }
        res.status(200).send({ status: 'success', result })
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {
        const { body: { first_name, last_name, email, age, password, role } } = req
        let user = await UserManagerDAO.getUserByEmail({ email })
        if (user) {
            req.logger.error(` ${req.method} en ${req.url} - User already exist`);
            throw new Exception('User already exists.', 400)
            //return res.status(400).json({ success: false, message: 'User already exists.' })
        }
        let newUser = new UserDTO( { first_name, last_name, email, age, password, role });
        user = await UserManagerDAO.createUser(newUser)
        res.status(201).json({ success: true })
    } catch (error) {
        next(error);
    }
}

export const deleteUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await UserManagerDAO.getUserByEmail({ email })
        if(!result){
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            throw new Exception('USER NOT FOUND', 404);
            //res.status(404).json({ message: "USER NOT FOUND" });
        }
        await UserManagerDAO.deleteUserByEmail({email});
        return res.status(200).json({ message: "USER DELETED" });
    } catch (error) {
        next(error);
    }
}

export const addCartToUser = async (req, res, next) => {
    try {
        const { email } = req.params;
        const { cid } = req.body;

        const user = await UserManagerDAO.getUserByEmail({ email: email })
        if(!user){
            req.logger.error(` ${req.method} en ${req.url} - User doesn't exist`);
            throw new Exception('USER NOT FOUND', 404);
        }
        user.cart = cid;
        const response = await UserManagerDAO.addCartToUser(email, user);
        res.status(200).json({response});
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { body: { email, password } } = req
        const user = await UserManagerDAO.getUserByEmail({ email })
        if(!user) {
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            req.logger.debug(` ${req.method} en ${req.url} - Esto fue una prueba de debug`)
            throw new Exception('Email or password is incorrect.', 401)
            //return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
        }
        if(!validatePassword(password, user)) {
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            throw new Exception('Email or password is incorrect.', 401)
            //return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
        }
        const token = tokenGenerator(user)
        req.logger.info(` ${req.method} en ${req.url} - ${user} `)
        
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).status(200).json({ success: true})
    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token').status(200).json({ success: true });
        req.logger.info(` ${req.method} en ${req.url} - User logout!`);
        req.logger.warning(` ${req.method} en ${req.url} - Esto fue una prueba de logger warning`);
    } catch (error) {
        req.logger.info(` ${req.method} en ${req.url} - User not logged!`);
        next(error);
    }
}

export const resetPassword = async (req, res) => {
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
}

export const getCurrentUser = (req, res, next) => {
    try {
        req.logger.http(` ${req.method} en ${req.url} - Esto fue una prueba de logger http`);
        req.logger.fatal(` ${req.method} en ${req.url} - Esto fue una prueba de logger fatal`);
        res.json({ success: true, message: 'This is the current user:', user: req.user }) 
    } catch (error) {   
        next(error);
    }
}