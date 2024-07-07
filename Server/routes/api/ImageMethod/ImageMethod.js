
const { uploadMultipleImages, deleteImages, uploadImage, bufferToBinaryString } = require('../../../src/components/public method/ImageMethod/ImageMethods');
const path = require('path')
const fs = require('fs');
let regex = new RegExp("https:\/\/ik\.imagekit\.io\/");
const hostAddingImageToCDN = async (data, req, pathR) => {
    try {
        if (req.files['images']) {
            const binaryImagesPromises = req.files['images'].map(async (file) => {

                const binaryData = fs.readFileSync(file.path);
                const base64 = binaryData.toString('base64')
                const result = await uploadImage(base64, pathR)

                fs.unlinkSync(file.path)
                return result
            });
            const result = await Promise.all(binaryImagesPromises)
            if (result)
                data.images = result
        }
        // Xử lý tệp tin cho variations
        if (req.files['subImages']) {
            const variationFiles = req.files['subImages'];
            variationFiles.forEach(async (file, index) => {
                if (data.variations[index].image == file.filename) {
                    const binaryData = fs.readFileSync(file.path);
                    const base64 = binaryData.toString('base64')
                    const image = await uploadImage(base64, pathR)
                    data.variations[index].image = image;
                    fs.unlinkSync(file.path)

                }
            });
        }
        return data
    } catch (error) {
        console.log("hostAddingImageToCDN: " + error);
        return null
    }
}
const hostUpdateImageToCDN = async (data, req, pathR) => {
    try {
        // Images
        if (req.files['images']) {
            req.files['images'].map(async (file) => {
                if (Array.isArray(data.images)) {
                    data.images.forEach(async (item, index) => {
                        const keys = Object.keys(item);
                        const set = new Set(keys)
                        if (set.has("id")) {
                            await deleteImages([item.id])
                        }
                        if (set.has("url") && !regex.test(item["url"])) {
                            const binaryData = fs.readFileSync(file.path);
                            const base64 = binaryData.toString('base64')
                            const result = await uploadImage(base64, pathR)
                            fs.unlinkSync(file.path);
                            item = result;
                        }
                    })
                } else {
                    const binaryData = fs.readFileSync(file.path);
                    const base64 = binaryData.toString('base64')
                    const result = await uploadImage(base64, pathR)
                    fs.unlinkSync(file.path);
                    data.image = result;
                }

            });

        }


        // subImages
        if (req.files['subImages']) {
            const variationFiles = req.files['subImages'];
            variationFiles.forEach(async (file, index) => {
                if (typeof data.variations !== "undefined")
                    data.variations.forEach(async (item, index) => {
                        const keys = Object.keys(item?.subImage);
                        let set = new Set(keys)
                        if (set.has('id'))
                            await deleteImages([item.id])
                        if (set.has('url') && !regex.test(item["url"])) {
                            const binaryData = fs.readFileSync(file.path);
                            const base64 = binaryData.toString('base64')
                            const image = await uploadImage(base64, pathR)
                            fs.unlinkSync(file.path)
                            item.subImage = image
                        }
                    })
                else if (typeof data.subCategory !== "undefined")
                    data.subCategory.forEach(async (item, index) => {
                        if (typeof item.subImage == 'undefined') return;
                        const keys = Object.keys();
                        let set = new Set(keys)
                        if (set.has('id'))
                            await deleteImages([item.id])
                        if (set.has('url') && !regex.test(item["url"])) {
                            const binaryData = fs.readFileSync(file.path);
                            const base64 = binaryData.toString('base64')
                            const image = await uploadImage(base64, pathR)
                            fs.unlinkSync(file.path)
                            item.subImage = image
                        }
                    })
            });
        }
        return data
    } catch (error) {
        console.log("hostAddingImageToCDN: " + error);
        return null
    }
}
module.exports = { hostAddingImageToCDN, hostUpdateImageToCDN }