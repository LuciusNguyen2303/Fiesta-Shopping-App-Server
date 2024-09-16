
const { uploadMultipleImages, deleteImages, uploadImage, bufferToBinaryString } = require('../../../src/components/public method/ImageMethod/ImageMethods');
const path = require('path')
const fs = require('fs');
const { log } = require('console');
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
        if (req.files['subImages']) {
            const variationFiles = req.files['subImages'];
        
            const uploadPromises = variationFiles.map((file, index) => {
                return new Promise(async (resolve, reject) => {
                    try {
                        if (data.variations[index].image == file.filename) {
                            const binaryData = fs.readFileSync(file.path);
                            const base64 = binaryData.toString('base64');
                            const image = await uploadImage(base64, pathR);
                            data.variations[index].subImage = image;
                            delete data.variations[index].image;
                            fs.unlinkSync(file.path);
                            console.log("ADDING ", data.variations[index]);
                        }
                        resolve(); 
                    } catch (error) {
                        reject(error); 
                    }
                });
            });
        
           
           
        }
        if (req.files['subImage']) {
            await new Promise(async (resolve, reject) => {
                try {
                   const file = req.files['subImage'][0]

                   if (data.image == file.filename) {

                        const binaryData = fs.readFileSync(file.path);
                        const base64 = binaryData.toString('base64');
                        const image = await uploadImage(base64, pathR);
                        data.subImage = image;
                        delete data.image;
                        fs.unlinkSync(file.path);
                        console.log("ADDING ", data);
                    }
                    resolve(); 
                } catch (error) {
                    reject(error); 
                }
            });
        }
        return data;
        
    } catch (error) {
        console.log("hostAddingImageToCDN: " + error);
        return null
    }
}
const hostUpdateImageToCDN = async (data, req, pathR) => {
    try {
        // Images
        if (req.files['images']) {
            await Promise.all(req.files['images'].map(async (file) => {
                if (Array.isArray(data.images)) {
                    data.images.forEach(async (item, index) => {
                        const keys = Object.keys(item);
                        const set = new Set(keys)
                        if (set.has("id")) {
                            await deleteImages([item.id])
                        }
                        if (set.has("url") && !regex.test(item["url"])) {
                            const binaryData = fs.readFileSync(file.path);
                            const result = await uploadImage(binaryData, pathR)
                            fs.unlinkSync(file.path);
                            item = result;
                        }
                    })
                } else {
                    console.log("ID IMAGE: ",data.image.id);
                    
                    const item= data.image
                    const set = new Set( Object.keys(item))
                    if (set.has("id")) {
                        await deleteImages([item.id])
                    }
                    if (set.has("url") && !regex.test(item["url"])) {
                        const binaryData = fs.readFileSync(file.path);
                        const base64 = binaryData.toString('base64')
                       
                        
                        const result = await uploadImage(base64, pathR)
                        fs.unlinkSync(file.path);
                        data.image = result;
                    }
                 
                }

            }));

        }
        // subImages
        if (req.files['subImages']) {
            const variationFiles = req.files['subImages'];
            await Promise.all( 
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
            }));
        }   
        
        if (req.files['subImage']) {
            await new Promise(async (resolve, reject) => {
                try {                    
                    const file= req.files['subImage'][0]
                    console.log("UPDATE SUBIMAGE",data.variation.image , file.filename);

                   
                    if (data.variation.image.url == file.filename) {
                        await deleteImages([data.variation.image.id])
                        const binaryData = fs.readFileSync(file.path);
                        const base64 = binaryData.toString('base64');
                        const image = await uploadImage(base64, pathR);
                        data.variation.subImage = image;
                        delete data.variation.image;
                        fs.unlinkSync(file.path);
                        console.log("UPDATE ", data);
                    }
                    resolve(); 
                } catch (error) {
                    reject(error); 
                }
            });
        }
        return data
    } catch (error) {
        console.log("hostUpdateImageToCDN: " + error);
        return null
    }
}
module.exports = { hostAddingImageToCDN, hostUpdateImageToCDN }