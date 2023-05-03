import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import passport from 'passport';

const JWT_SECRET = "sshhhhhhh"

// Aplico el proceso de hasheo con hashSync
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};


// compareSync lo uso para comparar el password recibido sin hashear con el password ya hasheado en la BD
export const validatePassword = (password, newUser) => {
    return bcrypt.compareSync(password, newUser.password);
}


// generador de token usando JWT Strategy
export const tokenGenerator = (user) => {
    const payload = {
      name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      age: user.age,
      role: user.role
    }
    const token = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: '24h' });
    return token;
  }
  
export const isValidToken = (token) => {
    return new Promise((resolve) => {
        jsonwebtoken.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                console.log('err', error)
                return resolve(false)
            }
            console.log('payload', payload)
            return resolve(true);
        })
        return token
    })
}   

// Middleware controlador de errores y autenticación
export const authMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info){
        if (error) {
            return next(error)
        }
        if (!user) {
            return res.status(401).json({ success: false, message: info.message ? info.message : info.toString() })
        }
        req.user = user;
        next();
    })(req, res, next)
}

// Middleware controlador de roles - Autorizaciones
export const authorizationMiddleware = (role) => (req, res, next) => {
    // ya el middleware de autenticación cubre esto pero para prevenir:
    if(!req.user) return res.status(401).json({ success: false, message: 'Unauthorized'})
    //continuamos...
    if(req.user.role != role) {
        return res.status(403).json({ success: false, message: 'Forbidden' })
    }
    next()
}



