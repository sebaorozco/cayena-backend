export const getCarts = async (req, res) => {
    res.send({ status: 'success', result: 'getCarts' })
}

export const getCartById = async (req, res) => {
    res.send({ status: 'success', result: 'getCartById'})
}

export const createCart = async (req, res) => {
        const { body: { first_name, last_name, email, age, password } } = req
        let user = await UserManagerDAO.getUserByEmail({ email })
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists.' })
        }
        user = await UserManagerDAO.createUser({ first_name, last_name, email, age, password: createHash(password) })
        res.status(201).json({ success: true })
}

export const purchase = async (req, res) => {
    res.send({ status: 'success', result: 'purchase' })
}

export const addProductToCartFromBody = async (req, res) => {
    res.send({ status: 'success', result: 'addProductToCartFromBody' })
}

export const addProductToCartFromParams = async (req, res) => {
    res.send({ status: 'success', result: 'addProductToCartFromParams' })
}

export const removeProductFromCart = async (req, res) => {
    res.send({ status: 'success', result: 'removeProductFromCart' })
}

export const deleteCartById = async (req, res) => {
    res.send({ status: 'success', result: 'deleteCartById' })
}