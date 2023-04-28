import { UsersModel } from "../models/user.model.js";

class UserManagerDAO {
    
    //CREO UN USER 
    static async createUser(userInfo) {
    
        return await UsersModel.create(userInfo);
        
    }
/*
    //BUSCO UN USUARIO EN LA DB
    static async getAnUser(email) {
        try {
            return await UsersModel.findOne({ email });
        } catch (error) {
            return error;
        }
    } */

    //OBTENGO TODOS LOS USUARIOS
    static async getUsers(req, res) {
        const result = await UsersModel.find();
        res.status(200).json(result);
    }

    
    
  /*  
    //OBTENGO USUARIOS CON FILTROS EN PARAMS
    static async getAllProducts(options) {
        try {
            return await ProductsModel.paginate({}, options);
        } catch (error) {
            console.log("Cannot get products with mongoose: "+ error);
        }
    }

    //OBTENGO UN PRODUCTO POR ID
    static async getProductById(pid) {
        const result = await ProductsModel.findById(pid)
        if (!result) {
          return "Producto no encontrado.";
        }
        return result;
    }

    //OBTENGO UN PRODUCTO POR CATEGORY
    static async getProducstByCategory(options, cat) {
        const result = await ProductsModel.paginate({ category: cat }, options)
        if (!result) {
          return "Producto no encontrado.";
        }
        return result;
    }

    //MODIFICO UN PRODUCTO POR ID
    static async updateProductById(pid, updateProductInfo) {
        try {
            const result = await ProductsModel.findById(pid);
            if(result){
                await ProductsModel.updateOne({ _id: pid }, updateProductInfo);
                const data = await ProductsModel.findById(pid);    
                return data;
            }
        } catch (error) {
            return error
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

    //ELIMINO TODOS LOS PRODUCTOS
    static async deleteAllProducts() {
        try {
            await ProductsModel.deleteMany();
        } catch (error) {
            console.log(error);
        }
    }*/
}
    
export default UserManagerDAO;