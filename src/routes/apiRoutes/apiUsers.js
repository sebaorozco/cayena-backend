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


export default router;