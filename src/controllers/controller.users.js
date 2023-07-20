import { UserManagerDAO } from "../dao/factory.js"
import { UsersModel } from "../dao/models/user.model.js";
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
            req.logger.info(`${req.method} en ${req.url} - User already exist`);
            throw new Exception('User already exists.', 400)
        }
        let newUser = new UserDTO( { first_name, last_name, email, age, password, role });
        user = await UserManagerDAO.createUser(newUser)
        console.log('user: ', user)
        res.status(201).json({ success: true, payload: user })
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
            throw new Exception('Email or password is incorrect.', 401)
            //return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
        }
        if(!validatePassword(password, user)) {
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            throw new Exception('Email or password is incorrect.', 401)
            //return res.status(401).json({ success: false, message: 'Email or password is incorrect.' })
        }
        if(user.status === 'active') {
            req.logger.error(` ${req.method} en ${req.url} - User already logged!`);
            throw new Exception('User already logged!', 401)
        }

        // Si se loguea se actualiza el campo "last_connection" y seteo al user como activo para no volver a permitir que se loguee de nuevo
        user.status = 'active';
        user.last_connection = new Date(); 
        await user.save();
        
        const token = tokenGenerator(user)
        req.logger.info(` ${req.method} en ${req.url} - ${user} `)
        
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).status(200).json({ 
            success: true, 
            message: 'User Logged in!',
            payload: user
        });
        
        
    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        const email = req.user.email;
        const user = await UserManagerDAO.getUserByEmail({ email })
        if(user.status === 'inactive'){
            req.logger.error(` ${req.method} en ${req.url} - User not logged!`);
            throw new Exception('User not logged!', 401)
        }
        // Si se desloguea se actualiza el campo "last_connection" y el campo status
        user.last_connection = new Date(); 
        user.status = 'inactive';
        await user.save();

        req.logger.info(` ${req.method} en ${req.url} - User logout!: - ${user}`);
        res.clearCookie('token').status(200).json({ success: true, message: 'User Logout!', payload: user });
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
        res.json({ success: true, message: 'This is the current user:', user: req.user }) 
    } catch (error) {   
        next(error);
    }
}

export const changeUserRole = async (req, res, next) => {
    try {
        const { uid } = req.params;
  
        const user = await UserManagerDAO.getUserById(uid);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        let newRole = '';
        if (user.role === 'user') {
            newRole = 'premium';
        } else if (user.role === 'premium') {
            newRole = 'user';
        } else {
            return res.status(400).json({ message: 'Rol de usuario inválido' });
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({ message: 'Rol de usuario actualizado exitosamente', newRole });
 
    } catch (error) {   
        next(error);
    }
}

export const uploadDocuments = async (req, res, next) => {
    try {
        const { uid } = req.params;
  
        const user = await UserManagerDAO.getUserById(uid);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

       
    } catch (error) {
        next(error);
    }
}

