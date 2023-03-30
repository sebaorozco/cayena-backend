import { Router } from 'express'
import { prodModel } from '../../dao/models/product.model.js'

const routerProductView = Router()

routerProductView.get('/', async (req, res) => {
  const productos = await prodModel.find().lean()
  res.render('productosDB', { productos: productos })
})

export default routerProductView