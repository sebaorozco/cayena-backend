import { Router } from "express";
import ProductManagerDAO from "../../dao/mongoManagers/ProductManagerDAO.js";
import commonsUtils from "../../utils/common.js";
//import { ProductsModel } from "../../dao/models/product.model.js";
//import commonsUtils2 from "../../utils/common2.js";

const router = Router();

//READ

router.get('/', async (req, res) => {
    try {
        const {query: {limit= 10, page= 1, sort}} = req;
        const options = {
            limit,
            page
        }
        if(sort){
            options.sort = { price: sort }
        }
        const result = await ProductManagerDAO.getAllProducts(options);
        res.status(201).render('products', commonsUtils.buildResponse({...result, sort}));
    } catch (error) {
        res.json({ error: error.message });
    }
})

// Obtengo un producto por Category
router.get('/category/:cat', async (req, res) => {
    try {
        const { cat } = req.params;
        const {query: {limit= 10, page= 1, sort}} = req;
        const options = {
            limit,
            page
        }
        if(sort){
            options.sort = { price: sort }
        }
        const result = await ProductManagerDAO.getProductsByCategory(options, cat)
        res.status(201).render('productsByCategory', commonsUtils.buildResponse({...result, sort, cat}));
    } catch (error) {
        res.json({ error: error.message });
    }
}) 

export default router; 