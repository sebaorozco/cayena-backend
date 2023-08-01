import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        // Especifica la carpeta de destino según el tipo de archivo
        if (file.fieldname === 'profile') {
            cb(null, process.cwd() + '/src/public/images/profiles');
        } else if (file.fieldname === 'product') {
        cb(null, process.cwd() + '/src/public/images/products');
        } else if (file.fieldname === 'document') {
            cb(null, process.cwd() + '/src/public/images/documents');
        } else {
            cb(new Error('Invalid file type.'));
        }     
        /* if (file.mimetype.startsWith('image/')) {
            if (file.fieldname === 'profile') {
              cb(null, process.cwd() + '/src/public/images/profiles');
            } else if (file.fieldname === 'product') {
              cb(null, process.cwd() + '/src/public/images/products');
            }
        } else if (file.mimetype === 'application/pdf') {
            cb(null, process.cwd() + '/src/public/images/documents');
        } else {
            cb(new Error('Invalid file type.'));
        }     
         */
    },
    filename: function(req, file, cb){
        cb(null, file.originalname)
    }
})

const uploader = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Verifica que los tipos de archivo sean válidos.
        if (file.fieldname === 'profile' || file.fieldname === 'product') {
          if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Solo se permiten imágenes.'));
          }
        } else if (file.fieldname === 'document') {
          if (!file.mimetype.startsWith('application/pdf')) {
            return cb(new Error('Solo se permiten documentos PDF.'));
          }
        }
        cb(null, true);
    },
});    

export default uploader;