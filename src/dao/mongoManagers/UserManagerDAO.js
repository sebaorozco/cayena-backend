import { UsersModel } from "../models/user.model.js";
import UserDTO from "../../dto/UsersDTO.js";

class UserManagerDAO {
    
    //CREO UN USER 
    static async createUser(userInfo) {
        return await UsersModel.create(userInfo);
    }

    //OBTENGO TODOS LOS USUARIOS
    static async getUsers(req, res) {
        const result = await UsersModel.find();
        return result;
    }

    //OBTENGO UN USUARIO POR EMAIL
    static async getUserByEmail ({email}) {
        try {
            const user = await UsersModel.findOne({ email: email })
            return user;
        } catch (error) {
            return "Usuario inexistente.";;
        }
    }

    //ELIMINO UN USUARIO POR MAIL
    static async deleteUserByEmail({email}) {
        const result = await UsersModel.findOne({email});
        if(!result){
            return "Usuario inexistente.";
        }
        return await UsersModel.deleteOne({ email });  
    }

    //AGREGO CARRITO A UN USUARIO
    static async addCartToUser (email, user) {
        try {
            const response = await UsersModel.updateOne({ email: email }, user);
            return response;
        } catch (error) {
            return 'Error';
        }
    }

    // LOGIN DE USARIO
    static async loginUser (req, res) {
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
    }


    // LOGOUT DE USARIO
    static async logoutUser (req, res) {
        res.clearCookie('token').status(200).json({ success: true })
    }
}
    
export default UserManagerDAO;