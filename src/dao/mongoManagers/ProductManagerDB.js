import { prodModel } from "../models/product.model";

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
        const result = await prodModel.find()
        res.status(200).json(result)
      }

    //OBTENGO UN PRODUCTO POR ID
      static async getById(req, res) {
        const { params: { id } } = req
        const result = await prodModel.findById(id)
        if (!result) {
          return res.status(404).end()
        }
        res.status(200).json(result)
      }

    //MODIFICO UN PRODUCTO POR ID
      static async updateById(req, res) {
        const { params: { id }, body } = req
        await prodModel.updateOne({ _id: id }, { $set: body })
        res.status(204).end()
      }
    //ELIMINO UN PRODUCTO POR ID
      static async deleteById(req, res) {
        const { params: { id } } = req
        await prodModel.deleteOne({ _id: id })
        res.status(204).end()
      }
    
}
    
export default ProductManagerDB;