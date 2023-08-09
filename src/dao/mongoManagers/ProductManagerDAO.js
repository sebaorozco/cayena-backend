import { ProductsModel } from "../models/product.model.js";

class ProductManagerDAO {
    
    //CREO UN PRODUCTO 
    static async createProduct(prod) {
        try {
            return await ProductsModel.create(prod);    
        } catch (error) {
            return null;
        }
    }

    //OBTENGO TODOS LOS PRODUCTOS CON FILTROS EN PARAMS
    static async getAllProducts(options) {
        try {
            return await ProductsModel.paginate({}, options);
        } catch (error) {
            return null;
        }
    }

    //OBTENGO UN PRODUCTO POR ID
    static async getProductById(pid) {
        try {
            return await ProductsModel.findById(pid);
        } catch (error) {
            return null;
        }
    }

    //OBTENGO UN PRODUCTO POR CATEGORY
    static async getProducstByCategory(cat) {
        try {
            console.log(cat);
            return await ProductsModel.find({category: cat})
        } catch (error) {
            return null;    
        }  
    }

    //MODIFICO UN PRODUCTO POR ID
    static async updateProductById(pid, updateProductInfo) {
        try {
            return await ProductsModel.updateOne({ _id: pid }, updateProductInfo);
        } catch (error) {
            return null;
        }
    }

    //ELIMINO UN PRODUCTO POR ID
    static async deleteProductById(pid) {
        try {
            const result = await ProductsModel.deleteOne({ _id: pid });
            return result;
        } catch (error) {
            return null;
        }
    }

    //ELIMINO TODOS LOS PRODUCTOS
    static async deleteAllProducts() {
        try {
            await ProductsModel.deleteMany();
        } catch (error) {
            console.log(error);
        }
    }
}
    
export default ProductManagerDAO;