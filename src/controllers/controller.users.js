import UserManagerDAO from "../dao/mongoManagers/UserManagerDAO.js"
import { createHash, tokenGenerator, validatePassword, authMiddleware, authorizationMiddleware } from "../utils/index.js";


export const getUsers = async (req, res, next) => {
    try {
        let result = await UserManagerDAO.getUsers();
        if(!result) {
            return res.status(500).send({ status: 'error', error: 'Something went wrong. Try again later.' })
        }
        res.status(200).send({ status: 'success', result })
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {
        const { body: { first_name, last_name, email, age, password } } = req
        let user = await UserManagerDAO.getUserByEmail({ email })
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists.' })
        }
        user = await UserManagerDAO.createUser({ first_name, last_name, email, age, password: createHash(password) })
        res.status(201).json({ success: true })
    } catch (error) {
        next(error);
    }
}

export const deleteUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;
        const result = await UserManagerDAO.getUserByEmail({ email })
        if(!result){
            res.status(404).json({ message: "USER NOT FOUND" });
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
        console.log(user)
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
    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('token').status(200).json({ success: true })
    } catch (error) {
        next(error);
    }
}

export const resetPassword = async (req, res) => {
    res.send({ status: 'success', result: 'resetPassword' })
}