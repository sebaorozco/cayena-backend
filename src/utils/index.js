import bcrypt from 'bcrypt';

// Aplico el proceso de hasheo con hashSync
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};


// compareSync lo uso para comparar el password recibido sin hashear con el password ya hasheado en la BD
export const validatePassword = (password, newUser) => {
    return bcrypt.compareSync(password, newUser.password);
}