import { Router } from "express";
import uploader from "../../utils/multer.utils.js"
import { createProduct, deleteAllProducts, deleteProductById, getAllProducts, getProductById, getProductsByCategory, updateProductById } from "../../controllers/controller.products.js";
import { authJWTMiddleware } from "../../utils/index.js";


const router = Router();

//CREATE
router.post('/', authJWTMiddleware(['admin', 'premium']), uploader.fields([
    { name: 'profile', maxCount: 1 },
    { name: 'product', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]), createProduct);

// READ
router.get('/', getAllProducts)

// Obtengo un producto por ID
router.get('/:pid', getProductById)

// Obtengo un producto por Category
router.get('/category/:cat', getProductsByCategory) 

// UPDATE
router.put('/:pid', authJWTMiddleware(['admin', 'premium']), updateProductById)

// DELETE -elimino un producto por su id
router.delete('/:pid', authJWTMiddleware(['admin', 'premium']), deleteProductById)

// DELETE all Products
router.delete('/', authJWTMiddleware(['admin']), deleteAllProducts)

export default router; 