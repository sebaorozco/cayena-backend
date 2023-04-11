import { ProductsModel } from "../models/product.model.js";

class ProductManagerDAO {
    
    //CREO UN PRODUCTO 
    static async createProduct(productInfo) {
        try {
             return await ProductsModel.create(productInfo)
        } catch (error) {
            return error.message;
        }
    }

    //OBTENGO TODOS LOS PRODUCTOS
    static async getAllProducts() {
        try {
            return await ProductsModel.find();
        } catch (error) {
            console.log("Cannot get products with mongoose: "+ error);
        }
    }

    //OBTENGO UN PRODUCTO POR ID
    static async getProductById(req, res) {
        const { params: { pid } } = req
        const result = await ProductsModel.findById(pid)
        if (!result) {
          return res.status(404).send("Producto no encontrado.");
        }
        res.status(200).json(result)
    }

    //MODIFICO UN PRODUCTO POR ID
    static async updateProductById(pid, updateProductInfo) {
        try {
            const result = await ProductsModel.findById(pid);
            if(result){
                return await ProductsModel.updateOne({ _id: pid }, updateProductInfo);
            }
        } catch (error) {
            return res.status(400).json("No se puede eliminar un Producto inexistente.")
        }
    }

    //ELIMINO UN PRODUCTO POR ID
    static async deleteProductById(pid) {
        const result = await ProductsModel.findById(pid);
        if(!result){
            return res.status(404).json("No se puede eliminar un Producto inexistente.")
        }
        return await ProductsModel.deleteOne({ _id: pid });
    }
}
    
export default ProductManagerDAO;