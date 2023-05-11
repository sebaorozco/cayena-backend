import { ProductsModel } from "../models/product.model.js";

class ProductManagerDAO {
    
    //CREO UN PRODUCTO 
    static async createProduct(req, res) {
        try {
            const {title, description, code, price, stock, category} = req.body;
            const productInfo = {
                title,
                description,
                code,
                price,
                stock,
                category,
                thumbnails: req.file.filename
            }
            const newProduct = await ProductsModel.create(productInfo);
            res.status(201).json({message: newProduct});   
        } catch (error) {
            res.json({ error: error.message });
        }
    }

    //OBTENGO TODOS LOS PRODUCTOS CON FILTROS EN PARAMS
    static async getAllProducts(req, res, options) {
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

    //ELIMINO UN PRODUCTO POR ID
    static async deleteProductById(pid) {
        const result = await ProductsModel.findById(pid);
        if(!result){
            return res.status(404).json("No se puede eliminar un Producto inexistente.")
        }
        return await ProductsModel.deleteOne({ _id: pid });
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