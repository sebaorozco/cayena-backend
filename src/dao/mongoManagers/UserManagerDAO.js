import { UsersModel } from "../models/user.model.js";

class UserManagerDAO {
    
    //CREO UN USER 
    static async createUser(userInfo) {
        try {
            return await UsersModel.create(userInfo);
        } catch (error) {
            return null;
        }
    }

    //OBTENGO TODOS LOS USUARIOS
    static async getUsers() {
        try {
            return await UsersModel.find();
        } catch (error) {
            return null;
        }
    }

    //OBTENGO TODOS LOS USUARIOS CON FILTRO ENVIADO
    static async getFilteredUsers(filter) {
        try {
            return await UsersModel.find(filter);
        } catch (error) {
            return null;
        }
    }

    //OBTENGO UN USUARIO POR EMAIL
    static async getUserByEmail ({email}) {
        try {
            return await UsersModel.findOne({ email: email });
        } catch (error) {
            return null;
        }
    }

    //OBTENGO UN USUARIO POR ID
    static async getUserById (id) {
        try {
            return await UsersModel.findById({ _id: id }); 
        } catch (error) {
            return null;
        }
    }

    //ELIMINO UN USUARIO POR ID
    static async findByIdAndRemove(uid) {
        try {
            return await UsersModel.findByIdAndRemove(uid);  
        } catch (error) {
            return null;
        }
    }

    //ELIMINO UN USUARIO POR MAIL
    static async deleteUserByEmail({email}) {
        try {
            return await UsersModel.deleteOne({ email });  
        } catch (error) {
            return null;
        }
    }

    //AGREGO CARRITO A UN USUARIO
    static async addCartToUser (email, user) {
        try {
            const response = await UsersModel.updateOne({ email: email }, user);
            return response;
        } catch (error) {
            return null;
        }
    }
}


export default UserManagerDAO;