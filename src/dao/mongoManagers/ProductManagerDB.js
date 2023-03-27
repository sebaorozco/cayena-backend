import { prodModel } from "../models/product.model.js";

class ProductManagerDB {

    //CREO UN PRODUCTO 
    static async create(req, res) {
       const { body, /*file*/ } = req
       const imagenProducto = {
          ...body,
          //avatar: `/static/imgs/${file.originalname}`,
        }
        const newProduct = await prodModel.create(imagenProducto)
        res.status(201).json(newProduct)
    }

    //OBTENGO LOS PRODUCTOS
    static async get(req, res) {
        try {
            let products = await prodModel.find();
            res.status(200).json(products);
        } catch (error) {
            console.log("Cannot get products with mongoose: "+ error);
        }
    }

    //OBTENGO UN PRODUCTO POR ID
    static async getById(req, res) {
        const { params: { pid } } = req
        const result = await prodModel.findById(pid)
        if (!result) {
          return res.status(404).end()
        }
        res.status(200).json(result)
    }

    //MODIFICO UN PRODUCTO POR ID
    static async updateById(req, res) {
        const { params: { pid }, body } = req;
        const updateProduct = await prodModel.updateOne({ _id: pid }, { $set: body });
        res.status(204).json(updateProduct);
    }

    //ELIMINO UN PRODUCTO POR ID
    static async deleteById(req, res) {
        const { params: { id } } = req;
        const deleteProduct = await prodModel.deleteOne({ _id: pid });
        res.status(204).json(deleteProduct);
    }
    
}
    
export default ProductManagerDB;