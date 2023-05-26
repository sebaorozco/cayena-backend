import CartManagerDAO from "../dao/mongoManagers/CartManagerDAO.js"

export const getCarts = async (req, res) => {
    try {
        const carts = await CartManagerDAO.getCarts();
        res.send({ status: 'success', carts })
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const getCartById = async (req, res) => {
    try {
        const { params: { cid } } = req;
        const expectedCart = await CartManagerDAO.getCartById(cid);
        res.json({ expectedCart });
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const createCart = async (req, res) => {
    try {
        const { body } = req
        const newCart = await CartManagerDAO.createCart(body)
        res.status(201).json({success: true, payload: newCart});
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const addProductToCartFromParams = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        await CartManagerDAO.addProductToCartFromParams(pid, cid)
        res.json({success: true, message: "Product added."});
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const removeProductFromCart = async (req, res) => {
    try {
        const { pid, cid } = req.params;
        await CartManagerDAO.removeProductFromCart(pid, cid)
        res.json({ success: true, message: "Product removed."})
    } catch (error) {
        res.json({ error: error.message });
    }
}

export const deleteCartById = async (req, res) => {
    try {
        const { cid } = req.params;
        await CartManagerDAO.deleteCartById(cid)
        res.json({ success: true, message: "Cart deleted."})
    } catch (error) {
        res.json({ error: error.message });
    }   
}

export const purchase = async (req, res) => {
    res.send({ status: 'success', result: 'purchase' })
}