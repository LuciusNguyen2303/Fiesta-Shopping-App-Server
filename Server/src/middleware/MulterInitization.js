const multer= require('multer')
const currentFolder = process.cwd()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, `${currentFolder}/routes/api/uploads/`);
    },
    filename: (req, file, cb) => {
        cb(null,file.originalname);
    }
});

const upload = multer({ storage: storage,limits:{fileSize:1024*1024*20} })
module.exports={upload}