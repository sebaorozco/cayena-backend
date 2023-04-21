import { Router } from 'express'
import { CartsModel } from '../../dao/models/cart.model.js';

const router = Router()

router.get('/:cid', async (req, res) => {
  try {
    const { cid } = req.params;

    const cart = await CartsModel.findById(cid).populate('products.product_id');

    if (!cart) {
      throw new Error(`CART ${id} NOT FOUND`);
    }

    res.render('carts', { cart });
    //console.log(JSON.stringify(cart, null, 2));

  } catch (error) {
    console.error(error);
    res.status(400).send(error.message);
  }
});

export default router;
