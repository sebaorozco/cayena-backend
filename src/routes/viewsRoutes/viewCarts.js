import { Router } from 'express'
import { CartsModel } from '../../dao/models/cart.model.js';
import { authJWTMiddleware, calculateTotal, generateCode } from '../../utils/index.js';
import { CartManagerDAO, ProductManagerDAO, TicketManagerDAO, UserManagerDAO } from '../../dao/factory.js';
import Exception from '../../utils/exception.js';
import twilioServices from '../../services/twilio.services.js';

const router = Router()

router.get('/', authJWTMiddleware(['admin', 'user', 'premium']), async (req, res) => {
  try {
    const currentUser = req.user; // Obtengo el usuario actual
    const user = await UserManagerDAO.getUserByEmail({ email: currentUser.email });
    const cid = user.cart._id;

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

// AGREGAR PRODUCTOS AL CARRITO
router.put('/products/:pid', authJWTMiddleware(['admin', 'user', 'premium']), async (req, res, next) => {
  try {
    const { pid } = req.params;
    const currentUser = req.user; // Obtengo el usuario actual
    const user = await UserManagerDAO.getUserByEmail({ email: currentUser.email });
    const cartId = user.cart._id;
    
    // Obtengo el carrito en cuestión
    const cart = await CartManagerDAO.getCartById(cartId);
    if(!cart){
        throw new Exception('Cart not found', 404);
    }
    
    // Obtengo el producto en cuestión
    const prod = await ProductManagerDAO.getProductById(pid);
    if(!prod){
        throw new Exception('Product not found.', 404);
    }

    // Verifico el rol del usuario actual
    const rol = ["admin", "premium", "user"];
    if (!rol.includes(currentUser.role)) {
        return res.status(403).render('errors', { error: "Invalid user role." });
    }

    // Verifico si el usuario actual es "premium" y si el producto le pertenece
    if (
        currentUser.role === "premium" &&
        prod.owner &&
        prod.owner === currentUser.email
    ) {
        return res.status(403).render('errors', { error: "Premium users cannot add their own products to the cart."});
    }

    const productIndex = cart.products.findIndex((p) => p.product_id._id.toString() === pid);
    //console.log(productIndex)
    if (productIndex >= 0) {
        cart.products[productIndex].quantity += 1;
    } else {
        cart.products.push({ product_id: pid });
    }
    await cart.save();
    res.render('messages', {message: "Producto Agregado."});
  } catch (error) {
    next(error);
  }
})

router.post('/purchase', authJWTMiddleware(['admin', 'user', 'premium']), async (req, res, next) => {
  try {
    const currentUser = req.user; // Obtengo el usuario actual
    const user = await UserManagerDAO.getUserByEmail({ email: currentUser.email });
    const cid = user.cart._id;
    
    // Obtengo el carrito en cuestión
    const cart = await CartManagerDAO.getCartById(cid);
    if(!cart){
        throw new Exception('Cart not found', 404);
    }
     
    if(cart.products.length <= 0){
        throw new Exception('Empty cart', 404);
    } else {

      const purchasedProducts = [];
      const returnedProducts = [];
      
      for (const item of cart.products) {
        const product = item.product_id;
        const quantity = item.quantity;
        
        if (product.stock >= quantity) {
          product.stock -= quantity;
          await product.save();
          purchasedProducts.push(item);
        } else {
            returnedProducts.push(item);
        }
      }
      // Creo el ticket de compra

      const code = generateCode(); // Genera un código único
      const amount = calculateTotal(purchasedProducts); // Calcula el total de la compra
      const purchaser = 'email@email.com';
      console.log('Ticket de compra: ', code, amount, purchaser)
      
      await TicketManagerDAO.createTicket(code, amount, purchaser);
      
      // Envío sms al cliente
      const nombre = purchaser;
      const clientPhone = '+543854160596'
      const body = `Gracias ${nombre}, tu solicitud de compra ha sido aprobada. `
      const result2 = await twilioServices.sendSMS(clientPhone, body)
      console.log('SMS enviado al cliente:',result2);

      // Actualizar el carrito con los productos no comprados
      cart.products = returnedProducts;
      await cart.save();

      return res.render('messages',{ purchasedProducts, returnedProducts });
    }

  } catch (error) {
      next(error);
  }
})

router.get('/ticket', authJWTMiddleware(['admin', 'user', 'premium']), async (req, res, next) => {
  try{
  res.render('ticket');
  } catch (error) {
      next(error);
  }
})
    
export default router;
