import multer from "multer";

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
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
        
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname)
    }
})

const uploader = multer({ storage });

export default uploader;