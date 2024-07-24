const { upload } = require("./MulterInitization")
const multer = require('multer')

function uploadFile(req, res, next) {
    const uploadFiles = upload.fields([{ name: 'images' }, { name: 'subImages' }]);

    uploadFiles(req, res, function (err) {
        try {

            if (err instanceof multer.MulterError) {
                console.log("Uploading images to server error(api)", err);

                // A Multer error occurred when uploading.
                return res.status(500).json({ error: err })
            } else if (err) {
                console.log("Uploading images to server error(api)", err);

                // An unknown error occurred when uploading.
                return res.status(500).json({ error: err })

            }

        } catch (error) {
            return res.status(500).json({ error: error })

        }
        // Everything went fine. 
        next()
    })
}
module.exports = { uploadFile }