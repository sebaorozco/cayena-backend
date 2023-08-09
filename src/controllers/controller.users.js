import { UserManagerDAO } from "../dao/factory.js"
import { UsersModel } from "../dao/models/user.model.js";
import UserDTO from "../dto/UsersDTO.js";
import { UserBasicDTO } from "../dto/UsersDTO.js";
import emailServices from "../services/email.services.js";
import Exception from "../utils/exception.js";
import { createHash, tokenGenerator, validatePassword, authMiddleware, authorizationMiddleware } from "../utils/index.js";


export const getUsers = async (req, res, next) => {
    try {
        let result = await UserManagerDAO.getUsers();
        if(!result) {
            req.logger.fatal(` ${req.method} en ${req.url} - Something went wrong. Try again later.`);
            throw new Exception('Something went wrong. Try again later.', 500);
        }
        res.status(200).send({ status: 'success', result })
    } catch (error) {
        next(error);
    }
}

export const getUsersData = async (req, res, next) => {
    try {
        let result = await UserManagerDAO.getUsers();
        if(!result) {
            req.logger.fatal(` ${req.method} en ${req.url} - Something went wrong. Try again later.`);
            throw new Exception('Something went wrong. Try again later.', 500);
        }
        // Mapeo los datos principales de cada usuario utilizando el DTO.
        const usersMainData = result.map((user) => {
            if (!user) {
                return null; 
            }
            return new UserBasicDTO(user);
      });
        res.status(200).send({ status: 'success', usersMainData })
    } catch (error) {
        next(error);
    }
}

export const getUserById = async (req, res, next) => {
    try {
        const { params: { uid } } = req;
        const expectedUser = await UserManagerDAO.getUserById( uid );
        if(!expectedUser){
            throw new Exception('User not found', 404);
        }
        res.json({ expectedUser });
       
    } catch (error) {
        next(error);
    }
}

export const createUser = async (req, res, next) => {
    try {
        const { body: { first_name, last_name, email, age, password, role } } = req
        let user = await UserManagerDAO.getUserByEmail({ email })
        if (user) {
            req.logger.info(`${req.method} en ${req.url} - User already exist`);
            throw new Exception('User already exists.', 400)
        }
        let newUser = new UserDTO( { first_name, last_name, email, age, password, role });
        user = await UserManagerDAO.createUser(newUser)
        console.log('user: ', user)
        res.status(201).json({ success: true, payload: user })
    } catch (error) {
        next(error);
    }
}

export const deleteUserByEmail = async (req, res, next) => {
    try {
        const { email } = req.body;
        const result = await UserManagerDAO.getUserByEmail({ email })
        if(!result){
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            throw new Exception('USER NOT FOUND', 404);
        }
        await UserManagerDAO.deleteUserByEmail({email});
        return res.status(200).json({ message: "USER DELETED" });
    } catch (error) {
        next(error);
    }
}

export const deleteInactiveUsers = async (req, res, next) => {
    try {
        // Obtengo la fecha actual y resto dos días para obtener la fecha límite de inactividad
        /* const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2); */
        const thirtyMinutesAgo = new Date();
        thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);

        // Busco los usuarios inactivos (última conexión anterior a twoDaysAgo)
        const inactiveUsers = await UserManagerDAO.getFilteredUsers({ last_connection: { $lt: thirtyMinutesAgo } });
        req.logger.info(` Inactive users: ${inactiveUsers}`);
        
        // Enviar el correo electrónico a los usuarios inactivos y eliminarlos
        inactiveUsers.forEach(async (user) => {
            const userEmail = user.email;
            const emailSubject = 'Eliminación de cuenta por inactividad';
            const emailHtml = `<p>Estimado usuario,</p>
                            <p>Su cuenta ha sido eliminada por presentar una inactividad mayor a 2 días.</p>
                            <p>Si deseas seguir formando parte de nuestro mundo orgánico y natural, podés registrarte nuevamente.</p>
                            <p>Atentamente,</p>
                            <p>Cayena Almacén Orgánico & Natural.</p>`;
  
            await emailServices.sendEmail(userEmail, emailSubject, emailHtml);
            await UserManagerDAO.findByIdAndRemove(user._id);
        });
  
        res.json({ message: 'Usuarios inactivos eliminados y correos electrónicos enviados.' });
    } catch (error) {
        next(error);
    }
}

export const addCartToUser = async (req, res, next) => {
    try {
        const { email } = req.params;
        const { cid } = req.body;

        const user = await UserManagerDAO.getUserByEmail({ email: email })
        if(!user){
            req.logger.error(` ${req.method} en ${req.url} - User doesn't exist`);
            throw new Exception('USER NOT FOUND', 404);
        }
        user.cart = cid;
        const response = await UserManagerDAO.addCartToUser(email, user);
        res.status(200).json({response});
    } catch (error) {
        next(error);
    }
}

export const loginUser = async (req, res, next) => {
    try {
        const { body: { email, password } } = req
        const user = await UserManagerDAO.getUserByEmail({ email })
        if(!user) {
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            throw new Exception('Email or password is incorrect.', 401)
        }
        if(!validatePassword(password, user)) {
            req.logger.error(` ${req.method} en ${req.url} - Email o password incorrect`);
            throw new Exception('Email or password is incorrect.', 401)
        }
        if(user.status === 'active') {
            req.logger.error(` ${req.method} en ${req.url} - User already logged!`);
            throw new Exception('User already logged!', 401)
        }

        // Si se loguea se actualiza el campo "last_connection" y seteo al user como activo para no volver a permitir que se loguee de nuevo
        user.status = 'active';
        user.last_connection = new Date(); 
        await user.save();
        
        const token = tokenGenerator(user)
        req.logger.info(` ${req.method} en ${req.url} - ${user} `)
        
        res.cookie('token', token, {
            maxAge: 60 * 60 * 1000,
            httpOnly: true
        }).status(200).json({ 
            success: true, 
            message: 'User Logged in!',
            payload: user
        });
        
    } catch (error) {
        next(error);
    }
}

export const logoutUser = async (req, res, next) => {
    try {
        const email = req.user.email;
        const user = await UserManagerDAO.getUserByEmail({ email })
        if(user.status === 'inactive'){
            req.logger.error(` ${req.method} en ${req.url} - User not logged!`);
            throw new Exception('User not logged!', 401)
        }
        // Si se desloguea se actualiza el campo "last_connection" y el campo status
        user.last_connection = new Date(); 
        user.status = 'inactive';
        await user.save();

        req.logger.info(` ${req.method} en ${req.url} - User logout!: - ${user}`);
        res.clearCookie('token').status(200).json({ success: true, message: 'User Logout!', payload: user });
    } catch (error) {
        req.logger.info(` ${req.method} en ${req.url} - User not logged!`);
        next(error);
    }
}

export const resetPassword = async (req, res) => {
    const {email, password} = req.body;

    if(!email || !password){
        return res.render('reset-password', { error: 'Debe completar todos los campos!'})
    }
    
    const newUser = await UsersModel.findOne({ email });
    
    if(!newUser){
        return res.render('reset-password', { error: 'Email o password inválido' });
    }

    newUser.password = createHash(password);

    await UsersModel.updateOne({ email }, newUser);
    
    res.redirect('/login');
}

export const getCurrentUser = (req, res, next) => {
    try {
        res.json({ success: true, message: 'This is the current user:', user: req.user }) 
    } catch (error) {   
        next(error);
    }
}

export const changeUserRole = async (req, res, next) => {
    try {
        const { uid } = req.params;
  
        const user = await UserManagerDAO.getUserById(uid);
        // Verifico si el usuario existe.
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verifico si el usuario ya es 'premium' o 'admin'.
        if (user.role === 'premium' || user.role === 'admin') {
            return res.status(400).json({ message: 'El usuario ya es "premium" o "admin".' });
        }

        // Verifico si se han cargado todos los documentos requeridos con el título 'document'.
        const requiredDocument = ['DNI', 'AddressProof', 'AccountStatement'];
        const uploadedDocument = user.documents.filter((el) => el.title === 'document');

        //Verifico primero si hay tiene cargado algún document
        if (!uploadedDocument){
            return res.status(400).json({ message: 'El usuario no tiene cargado ningún documento aún.' });
        } else {
            uploadedDocument.map((doc) => doc.name);
        }

        const allRequiredDocumentsUploaded = requiredDocument.every((doc) =>
        uploadedDocument.includes(doc));

        if (!allRequiredDocumentsUploaded) {
            return res.status(400).json({ message:'Cargue todos los documentos requeridos antes de actualizar a "premium".' });
        }

        // Actualizo el role del usuario a 'premium'.
        user.role = 'premium';
        await user.save();
        res.status(200).json({ message: 'Role del usuario actualizado a "premium" exitosamente.' });

    } catch (error) {   
        next(error);
    }
}

export const uploadDocuments = async (req, res, next) => {
    try {
        // Verifico que el usuario exista
        const { uid } = req.params;
        const user = await UserManagerDAO.getUserById(uid);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        // Variables para almacenar los mensajes de error.
        const errorMessages = [];
        
        // Verifico si ya hay un archivo de perfil subido.
        const profileAlreadyExists = user.documents.some((doc) => doc.title === 'profile');
        if (req.files['profile'] && profileAlreadyExists) {
            errorMessages.push('Archivo profile ya subido.');
        }

        // Verifico si ya hay un archivo de producto subido y no duplicar.
        if (req.files['product']) {
            const productNames = req.files['product'].map((file) => file.originalname);
            user.documents.forEach((doc) => {
                if (doc.title === 'product' && productNames.includes(doc.name)) {
                    errorMessages.push(`Archivo ${doc.name} ya subido como producto.`);
                }
            });
        }

        // Verifico si hay documentos PDF subidos y si hay duplicados.
        if (req.files['document']) {
            const validDocumentTypes = ['DNI', 'AddressProof', 'AccountStatement'];
            const documentNames = req.files['document'].map((file) => file.originalname);
            user.documents.forEach((doc) => {
                if (doc.title === 'document' && documentNames.includes(doc.name)) {
                    errorMessages.push(`Archivo ${doc.name} ya subido.`);
                }
            });
            req.files['document'].forEach((file) => {
                const documentType = file.originalname.split('.')[0];
                if (!validDocumentTypes.includes(documentType)){
                    // Si el documento no es un tipo válido, enviar un mensaje de error.
                    errorMessages.push(`Nombre de documento ${documentType} no válido. Solo puede ser de tipo: ${validDocumentTypes}`);
                }
            })
        }
        // Si hay errores, enviarlos como respuesta.
        if (errorMessages.length > 0) {
            return res.status(400).json({ message: 'Debe eliminar alguno de los siguientes errores para poder continuar con la carga de documentos: ', errorMessages });
        }
         
        // Guardo los archivos en el array de documents del usuario.
        const documents = [];

        // Verifico si hay archivos de productos para cargar.
        if (req.files['product']) {
            req.files['product'].forEach((file) => {
                documents.push({title: file.fieldname, name: file.filename, reference: file.path});
                user.uploadStatus = true;
            });
        }

        // Verifico si hay documentos PDF a subir.
        if (req.files['document']) {
            const validDocumentTypes = ['DNI', 'AddressProof', 'AccountStatement'];
            req.files['document'].forEach((file) => {
                const documentType = file.originalname.split('.')[0];
                if (validDocumentTypes.includes(documentType)) {
                    documents.push({title: file.fieldname, name: file.filename, reference: file.path});
                    user.uploadStatus = true;
                } 
            });
        }

        // Si hay un archivo de perfil nuevo, lo guardo.
        if (req.files['profile'] && !profileAlreadyExists) {
            const profileImage = req.files['profile'][0]; 
            documents.push({title: profileImage.fieldname, name: profileImage.filename, reference: profileImage.path}); 
        }

        // Actualizo el array de documents en el modelo de usuario.
        user.documents.push(...documents);
        await user.save();
        res.send('Archivos subidos correctamente.');

    } catch (error) {
        next(error);
    }
}