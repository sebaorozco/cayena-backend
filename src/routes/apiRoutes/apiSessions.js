import { Router } from "express";
import { UsersModel } from "../../dao/models/user.model.js";
import passport from "passport";
import { authMiddleware, createHash, isValidToken, tokenGenerator, validatePassword } from "../../utils/index.js";
import emailServices from "../../services/email.services.js";
import __dirname from "../../utils.js";
import { CartManagerDAO, UserManagerDAO } from "../../dao/factory.js";
import UserDTO, { UserBasicDTO } from "../../dto/UsersDTO.js";


const router = Router();

// REGISTRO DE USUARIO
router.post('/register', async (req, res, next) => {
    try {
        const { body: { first_name, last_name, email, age, password, role } } = req;
        if(!first_name || !last_name || !email || !age || !password) {
            return res.status(400).render('register', { error: 'Debe completar todos los campos para registrarse'})  
        }
        let user = await UserManagerDAO.getUserByEmail({ email })
        if (user) {
            req.logger.info(`${req.method} en ${req.url} - User already exist`);
            return res.status(400).render('register', { error: 'User already exist!'}) 
        }
        let newUser = new UserDTO( { first_name, last_name, email, age, password, role });
        user = await UserManagerDAO.createUser(newUser)
        return res.status(201).render('register', { error: `Usuario registrado con éxito`}) 
    } catch (error) {
        next(error);
    }
})

// LOGIN DE USUARIO
router.post('/', async (req, res, next) => {
    try {
        const { body: { email, password } } = req
        const user = await UserManagerDAO.getUserByEmail({ email })
        if(!user) {
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            return res.render('login', { error: 'Email o password incorrect!'})  
        }
        if(!validatePassword(password, user)) {
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            return res.render('login', { error: 'Email o password incorrect!'})  
        }
        if(user.status === 'active') {
            req.logger.error(` ${req.method} en ${req.url} - User already logged!`);
            return res.render('login', { error: 'User already logged!'});
        } 
        // Si se loguea creo un nuevo carrito y asocio ese cart al user.
        const newCart = await CartManagerDAO.createCart({title: `Carrito ${user.name}`});
        user.cart = newCart; 
        await UserManagerDAO.addCartToUser(email, user)
        // Si se loguea se actualiza el campo "last_connection" y seteo al user como activo para no volver a permitir que se loguee de nuevo
        user.status = 'active';
        user.last_connection = new Date(); 
        await user.save(); 

        const token = tokenGenerator(user)
        req.logger.info(` ${req.method} en ${req.url} - ${user} `)
        
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).redirect(`/profile`); 
        
    } catch (error) {
        next(error);
    }
})


// LOGOUT DE USUARIO
router.get('/logout', authMiddleware('jwt'), async (req, res, next) => {
    try {
        const email = req.user.email;
        const user = await UserManagerDAO.getUserByEmail({ email })
        if(user.status === 'inactive'){
            req.logger.error(` ${req.method} en ${req.url} - User not logged!`);
            return res.render('login', { error: 'User NOT logged!'});
        }
        // Si se desloguea se actualiza el campo "last_connection" y el campo status y elimino también el carrito
        user.last_connection = new Date(); 
        user.status = 'inactive';
        const deleteCartId = user.cart._id
        await CartManagerDAO.deleteCartById(deleteCartId);
        await user.save();
        res.clearCookie('token').status(200).redirect('/');
    } catch (error) {
        next(error);
    }
})

router.get('/users', authMiddleware('jwt'), async (req, res, next) => {
    try {
        const user = req.user;
        if (user.role != 'admin'){
            return res.render('errors', { error: 'Forbidden. Only Admin user'});
        }
        let result = await UserManagerDAO.getUsers();
        if(!result) {
            req.logger.fatal(` ${req.method} en ${req.url} - Something went wrong. Try again later.`);
            return res.render('errors', { error: 'Something went wrong. Try again later.'});
        }
        // Mapeo los datos principales de cada usuario utilizando el DTO.
        const usersMainData = result.map((user) => {
            if (!user) {
                return null; 
            }
            return new UserBasicDTO(user);
        });
        res.status(200).render('users', { users: usersMainData });
    } catch (error) {
        next(error);
    }
})

// FILTRAR INACTIVE USERS
router.get('/inactive-users', authMiddleware('jwt'), async (req, res, next) => {
    // Obtengo la fecha actual y resto dos días para obtener la fecha límite de inactividad
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    // Busco los usuarios inactivos (última conexión anterior a twoDaysAgo)
    const inactiveUsers = await UserManagerDAO.getFilteredUsers({ last_connection: { $lt: twoDaysAgo } });
    const inactiveUsersBasicData = inactiveUsers.map((user) => {
        if (!user) {
            return null; 
        }
        return new UserBasicDTO(user);
    });

    req.logger.info(` Inactive users: ${inactiveUsers}`);
    res.status(200).render('inactive-users', { users: inactiveUsersBasicData }); 
})

// DELETE INACTIVE USERS FROM FORM
router.post('/delete-user', authMiddleware('jwt'), async (req, res) => {
    const userId = req.body.userId;
    const user = await UserManagerDAO.getUserById(userId);
   
    // Obtengo la fecha actual y resto dos días para obtener la fecha límite de inactividad
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    if (user.last_connection < twoDaysAgo){
        // Enviar el correo electrónico a los usuarios inactivos y eliminarlos
        const userEmail = user.email;
        const emailSubject = 'Eliminación de cuenta por inactividad';
        const emailHtml = `<p>Estimado usuario,</p>
                        <p>Su cuenta ha sido eliminada por presentar una inactividad mayor a 2 días.</p>
                        <p>Si deseas seguir formando parte de nuestro mundo orgánico y natural, podés registrarte nuevamente.</p>
                        <p>Atentamente,</p>
                        <p>Cayena Almacén Orgánico & Natural.</p>`;
    
        await emailServices.sendEmail(userEmail, emailSubject, emailHtml);
        await UserManagerDAO.findByIdAndRemove(userId);
        res.render('messages', { message: `Usuario ${user.name} eliminado y correo electrónico enviado.` });
    } else {
        await UserManagerDAO.findByIdAndRemove(userId);
        res.render('messages', { message: `Usuario ${user.name} eliminado.` });
    }
})

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
    const { body: { email } } = req

    if(!email){
        return res.render('reset-password', { error: 'Debe completar con su correo!'})
    }
    
    const newUser = await UsersModel.findOne({ email });
    
    if(!newUser){
        return res.render('reset-password', { error: 'Email inexistente' });
    }

    const token = tokenGenerator(newUser, '1h');

    console.log('token', token);

    const attachments = [
        {
            filename: 'logoCayena.jpg',
            path: (__dirname + '/public/images/logoCayena/logoCayena.jpg'),
            cid: 'logoCayena'
        }
    ]
    const result = await emailServices.sendEmail(
        email,
        'Reset Password',
        `
        <div>
            <h1>Reestablecer Contraseña. 🔑</h1>'
            <p>Haz clic en el siguiente enlace para reestablecer tu contraseña</p>
            <a href="http://localhost:8080/change-password?token=${token}">Reestablecer Contraseña </a>
            <p>Saludos! 👋</p>
        </div>
        `,
        attachments
    )
    res.render('mail');
})

// CHANGE PASSWORD
router.post('/change-password', async (req, res) => {
    const { 
        query: { token },
        body: {newPassword, repeatNewPassword} 
    } = req;

    if (!newPassword || !repeatNewPassword){
        return res.render('change-password', { token, error: 'Debe ingresar las contraseñas!' });
    }

    if (newPassword !== repeatNewPassword){
        return res.render('change-password', { token, error: 'Las contraseñas no coiniciden!' });
    }

    if (!token){
        return res.render('change-password', { token, error: 'Token inexistente' });
    }

    const payload = await isValidToken(token);
    if (!payload){
        return res.render('change-password', { token, error: 'Token no es válido' });
    }
    const { id } = payload;

    const user = await UsersModel.findById(id);

    if (!user){
        return res.render('change-password', { token, error: 'Usuario inexistente' });
    }

    if (validatePassword(newPassword, user)){
        return res.render('change-password', { token, error: 'No puede utilizar una contraseña anterior' })
    }

    user.password = createHash(newPassword);

    await UsersModel.updateOne({ _id: id }, user);

    res.redirect('/');

})

// CHANGE USER ROLE

router.post('/change-role', authMiddleware('jwt'), async (req, res, next) => {
    try {
        const userId = req.body.userId;
        const newRole = req.body.newRole;

        const user = await UserManagerDAO.getUserById(userId);
        // Verifico si el usuario existe.
        if (!user) {
            return res.render('errors', { error: 'User not found'});
        }

        /* // Verifico si el usuario ya es 'premium' o 'admin'.
        if (user.role === 'premium' || user.role === 'admin') {
            return res.render('errors', { error: 'User is already "premium" or "admin".'});
        }

        // Verifico si se han cargado todos los documentos requeridos con el título 'document'.
        const requiredDocument = ['DNI', 'AddressProof', 'AccountStatement'];
        const uploadedDocument = user.documents.filter((el) => el.title === 'document');

        //Verifico primero si hay tiene cargado algún document
        if (!uploadedDocument){
            return res.render('errors', { error: 'El usuario no tiene cargado ningún documento aún.'});
             
        } else {
            uploadedDocument.map((doc) => doc.name);
        }

        const allRequiredDocumentsUploaded = requiredDocument.every((doc) =>
        uploadedDocument.includes(doc));

        if (!allRequiredDocumentsUploaded) {
            return res.render('errors', { error: 'Cargue todos los documentos requeridos antes de actualizar a "premium".'});
        } */

        // Actualizo el role del usuario.
        user.role = newRole;
        await user.save();
        res.render('messages', {message: 'Ha actualizado el role de usuario exitosamente'});

    } catch (error) {   
        next(error);
    }
})

// LOGIN POR GITHUB
router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), (req, res) => {
    // Successful authentication, redirect profile.
    console.log('req.user', req.user);
    req.session.user = req.user;
    res.redirect('/profile');
});



export default router;