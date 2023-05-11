import { Router } from "express";
import UserManagerDAO from "../../dao/mongoManagers/UserManagerDAO.js";
import { UsersModel } from "../../dao/models/user.model.js";

const router = Router();


// OBTENER USUARIOS
router.get('/', UserManagerDAO.getUsers);

// ELIMINAR USUARIOS
router.delete('/delete', async (req, res) => {
    try {
        const { email } = req.body;
        const result = await UsersModel.findOne({ email })
        if(!result){
            res.status(404).json({ message: "USER NOT FOUND" });
        }
        await UsersModel.deleteOne({email});
        return res.status(200).json({ message: "USER DELETED" });
    } catch (error) {
        return error;
    }
});

// AGREGA UN CARRITO A UN USER ESPECÍFICO, TOMANDO EL EMAIL DEL USUARIO 
router.put('/:email', async (req, res) => {
    try {
        const { email } = req.params;
        const { cid } = req.body;

        const user = await UsersModel.findOne({ email: email })
        user.cart = cid;
        
        const response = await UsersModel.updateOne({ email: email }, user);
        res.json({response});
    } catch (error) {
        res.json({ error });
    }
}) 


export default router;