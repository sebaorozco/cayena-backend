import { Router } from "express";
import uploader from "../../utils/multer.utils.js"
import { createProduct, deleteAllProducts, deleteProductById, getAllProducts, getProductById, getProductsByCategory, updateProductById } from "../../controllers/controller.products.js";


const router = Router();

//CREATE
router.post('/', uploader.single('image'), createProduct);

// READ
router.get('/', getAllProducts)

// Obtengo un producto por ID
router.get('/:pid', getProductById)

// Obtengo un producto por Category
router.get('/category/:cat', getProductsByCategory) 

// UPDATE
router.put('/:pid', updateProductById)

// DELETE -elimino un producto por su id
router.delete('/:pid', deleteProductById)

// DELETE all Products
router.delete('/', deleteAllProducts)

export default router; 