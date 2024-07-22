const multer= require('multer')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'D:/FiestaShopApp/Fiesta-Shopping-App-Server/Server/routes/api/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    }
});

const upload = multer({ storage: storage })
module.exports={upload}