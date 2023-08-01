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

/*      //OBTENGO DOCUMENTOS DE UN USUARIO POR SU ID
     static async getDocsById(did) {
        try {
            const expectedDocs = await UsersModel.findOne(documents) 
            return await expectedDocs.findById({ _id: did })     //.populate('documents._id');
        } catch (error) {
            return null;
        }   
    } */

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