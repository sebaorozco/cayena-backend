import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import passport from 'passport';
import Exception from './exception.js';
import { customAlphabet } from 'nanoid';
import config from '../config/index.js';

const JWT_SECRET = config.auth.JWT_secretOrKey;

// Aplico el proceso de hasheo con hashSync
export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
};


// compareSync lo uso para comparar el password recibido sin hashear con el password ya hasheado en la BD
export const validatePassword = (password, newUser) => {
    return bcrypt.compareSync(password, newUser.password);
}


// generador de token usando JWT Strategy
export const tokenGenerator = (user, exp = '24h') => {
    const payload = {
      //name: user.first_name,
      //last_name: user.last_name,
      email: user.email,
      id: user._id,
      //age: user.age,
      role: user.role
    }
    const token = jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: exp });
    return token;
  }
  
export const isValidToken = (token) => {
    return new Promise((resolve) => {
        jsonwebtoken.verify(token, JWT_SECRET, (error, payload) => {
            if (error) {
                console.log('err', error)
                return resolve(false)
            }
            //console.log('payload', payload)
            return resolve(payload);
        })
        return token
    })
}   

// Middleware controlador de errores y autenticación
export const authMiddleware = (strategy) => (req, res, next) => {
    passport.authenticate(strategy, function (error, user, info){
        if (error) {
            return next(error);
        }
        if (!user) {
            return next(new Exception('Unauthorized', 401));
        }
        if (user.role === 'user' && req.params.id !== user.id){
            return next(new Exception('Forbidden', 403));
        }
        req.user = user;
        next();
    })(req, res, next)
}

export const authJWTMiddleware = (roles) => (req, res, next) => {
    passport.authenticate('jwt', function (error, user, info){
        if (error) {
            return next(error);
        }
        if (!user) {
            return next(new Exception('Unauthorized', 401));
        }
        if (!roles.includes(user.role)) {
            return next(new Exception('Forbidden', 403))
          }
        if (user.role === 'user' && req.params.id && req.params.id !== user.id){
            return next(new Exception('Forbidden', 403));
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

// Middleware Generador de código aleatorio
export const generateCode = () => {
    const alphabet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const length = 8;
    const nanoid = customAlphabet(alphabet, length);
    return nanoid();
}

// Middleware para calcular el total de la compra
export const calculateTotal = (products) => {
    let total = 0;
    for (const item of products) {
        total += item.product_id.price * item.quantity;
    }
    return total;
}
