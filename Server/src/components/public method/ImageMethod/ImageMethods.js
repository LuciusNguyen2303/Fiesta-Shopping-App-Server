const imagekit = require('./ImageInitization')

/** 
* @param {"Users" | "Categories" | "Reviews"|"Products"} pathR
*/
const uploadImage = async (image, pathR) => {
    try {
        // if (validateInput(image) == "invalid")
        //     return null
        
        const response = await imagekit.upload({
            file: image,
            fileName: Date.now() + '.jpg',
            folder: `/FiestaApp/${pathR ? pathR : ""}`
        });
        return { id: response.fileId, url: response.url };
    } catch (error) {
        console.error('Error uploading image:', error);
        return null;
    }
};

function bufferToBinaryString(buffer) {
    let binaryString = '';
    for (const byte of buffer) {
        // Chuyển byte thành chuỗi nhị phân và đảm bảo độ dài là 8 ký tự
        binaryString += byte.toString(2).padStart(8, '0');
    }
    return binaryString;
}
const validateInput = (input) => {
    if (isValidURI(input)) {
        console.log("uri");
        return 'uri';
    } else if (isValidBase64(input)) {
        console.log("base64");
        return 'base64';
    } else if (isBinary(input)) {
        console.log("binary");
        return 'binary'
    } else {
        console.log("invalid");
        return 'invalid';
    }
};

const isValidURI = (str) => {
    const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return pattern.test(str);
};
function isBinary(str) {
    // Chuyển đổi giá trị thành chuỗi trước khi kiểm tra
    const strBinary = String(str);
    return /^[01]+$/.test(strBinary);
}
const isValidBase64 = (str) => {
    const base64Pattern = /^(data:image\/(?:png|jpg|jpeg|gif|bmp|webp);base64,)?([A-Za-z0-9+\/]{4})*(?:[A-Za-z0-9+\/]{2}==|[A-Za-z0-9+\/]{3}=)?$/;
    return base64Pattern.test(str);
};


/** 
* @param {"Users" | "Categories" | "Reviews"|"Products"} path
* @param {"Users" | "Categories" | "Reviews"|"Products"} pathR

*/
const uploadMultipleImages = async (images, path) => {
    const uploadPromises = images.map(image => uploadImage(image, path));
    try {
        const uploadedUrls = await Promise.all(uploadPromises);
        console.log('All images uploaded successfully:', uploadedUrls);
        return uploadedUrls;
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw error;
    }
};
const deleteImages = async (images) => {
    try {

        result = imagekit.bulkDeleteFiles(images)
            .then(response => {
                console.log("Image deleted successfully", response);
            })
            .catch(error => {
                console.error("Error deleting image", error);
            });

        //     const result =  await imagekit.bulkDeleteFiles(images)
        //   console.log('All images deleted successfully:', uploadedUrls);
        return result;
    } catch (error) {
        console.error('Error uploading multiple images:', error);
        throw error;
    }
};

module.exports = {bufferToBinaryString, uploadMultipleImages, uploadImage, deleteImages }