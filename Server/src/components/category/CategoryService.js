const { uploadImage, deleteImages } = require("../public method/ImageMethod/ImageMethods");
const categoryModel = require("./categoryModel");


const addCategory = async (
    data
) => {
    try {
        console.log(data);
        if (Object.keys(data).includes("image")) {
            const image = await uploadImage(data.image, "Categories")
            data.image = image
        }
        if (Object.keys(data).includes("subCategory")) {
            let subCategory = data.subCategory
            if (Array.isArray(subCategory) && subCategory.length > 0) {
            //    
             console.time("image")
                const subCategoryPromises = subCategory.map(async (item) => {

                    const image = await uploadImage(item.image, "Categories")
                    item.image = image
                    return item;
                })
                const result = await Promise.all(subCategoryPromises);
                console.timeEnd("image")
                data.subCategory = result
            }
        }
        const newCategory = new categoryModel(data)
        const result = await newCategory.save()
        return result;
    } catch (error) {
        console.log(`Adding new category error (Service)${error}`);
    }
}
const getAllCategory = async () => {
    try {
        const result = await categoryModel.find();
        if (result)
            return result;
        return null

    } catch (error) {
        console.log(`Getting all category error (Service)${error}`);
    }
}

const generateUpdateCategoryQuery = async (updateData) => {
    try {
        let queryUpdate = {},
            arrayFilter = []
        if (Object.keys(data).includes("name"))
            queryUpdate = {
                ...queryUpdate,
                $set: {
                    ...queryUpdate.$set,
                    name: updateData.name
                }
            };
        if (Object.keys(data).includes("image"))
            queryUpdate = {
                ...queryUpdate,
                $set: {
                    ...queryUpdate.$set,
                    image: updateData.image
                }
            };
        if (Object.keys(data).includes("subCategory")) {
            let subCategory = data.subCategory
            if (Array.isArray(subCategory) && subCategory.length > 0) {
                subCategory.forEach(async (item, index) => {
                    let key = `subCategory.elem$[${index}].`
                    if (typeof item.name !== 'undefined')

                        queryUpdate = {
                            ...queryUpdate,
                            $set: {
                                ...queryUpdate.$set,
                                [key + "name"]: item.name
                            }
                        };
                    if (typeof item.image !== 'undefined') {
                        if (typeof item.image.id !== 'undefined')
                            await deleteImages([item.image.id])
                        if (typeof item.image.url !== 'undefined') {
                            const image = await uploadImage(item.image.url, "Categories")
                            queryUpdate = {
                                ...queryUpdate,
                                $set: {
                                    ...queryUpdate.$set,
                                    [key + "image"]: image
                                }
                            };
                        }
                    }

                    arrayFilter.push({ [`${key}._id`]: item._id });

                })
            }
        }
        console.log(JSON.stringify(queryUpdate), JSON.stringify(generateUpdateCategoryQuery));
        return { query: queryUpdate, arrayFilter: arrayFilter }
    } catch (error) {
        console.log("ERROR generateUpdateCategoryQuery (Service):" + error);
        return { query: {}, arrayFilter: [] }
    }

}
const editCategory = async (
    id, updateData
) => {
    try {
        const queryUpdate = await generateUpdateCategoryQuery(updateData)
        const result = await categoryModel.findByIdAndUpdate(id, queryUpdate.query, { arrayFilters: queryUpdate.arrayFilter, new: true })
        if (result)
            return result
        return null
    } catch (error) {
        console.log(`Editing new category error (Service)${error}`);
    }
}
const deleteImageinCategory = async (data) => {
    try {
        let deletedImgArr = []
        if (Object.keys(data).includes("image"))
            deletedImgArr.push(data.image.id)
        if (Object.keys(data).includes("subCategory")) {
            const subCategory = data.subCategory
            if (Array.isArray(subCategory) && subCategory.length > 0) {
                subCategory.forEach(async (item, index) => {
                    if (typeof item.image !== 'undefined')
                        if (typeof item.image.id !== 'undefined')
                            deletedImgArr.push(item.image.id)
                })
            }
        }
        if (deletedImgArr.length > 0)
            return await deleteImages(deleteImages)
        return false
    } catch (error) {
        console.log("ERROR deleteImageinCategory(Service): " + error);
        return false
    }
}
const generateDeleteSubCategoryQuery = async (data) => {
    try {
        let queryUpdate = {},
            arrayFilter = []
        if (Object.keys(data).includes("subCategory")) {
            let subCategory = data.subCategory
            if (Array.isArray(subCategory) && subCategory.length > 0) {
                subCategory.forEach(async (item, index) => {
                    let key = `subCategory.elem$[${index}].`
                    if (typeof item._id !== 'undefined')

                        queryUpdate = {
                            ...queryUpdate,
                            $pull: {
                                ...queryUpdate.$pull,
                                [key + "_id"]: item._id
                            }
                        };
                  
                    arrayFilter.push({ [`${key}._id`]: item._id });

                })
            }
        }
        console.log(JSON.stringify(queryUpdate), JSON.stringify(generateUpdateCategoryQuery));
        return { query: queryUpdate, arrayFilter: arrayFilter }
    } catch (error) {
        console.log("ERROR generateUpdateCategoryQuery (Service):" + error);
        return { query: {}, arrayFilter: [] }
    }

}
const deleteImageinSubCategory = async (data) => {
    try {
        let deletedImgArr = []
        if (Object.keys(data).includes("subCategory")) {
            const subCategory = data.subCategory
            if (Array.isArray(subCategory) && subCategory.length > 0) {
                subCategory.forEach(async (item, index) => {
                    if (typeof item.image !== 'undefined')
                        if (typeof item.image.id !== 'undefined')
                            deletedImgArr.push(item.image.id)
                })
            }
        }
        if (deletedImgArr.length > 0)
            return await deleteImages(deleteImages)
        return false
    } catch (error) {
        console.log("ERROR deleteImageinCategory(Service): " + error);
        return false
    }
}

const deleteAnItemSubcategory = async (id, data) => {
    try {
        console.log(`ID la ${id}`);
        const category = await categoryModel.findOne({ _id: id })
        if (category) {
            await deleteImageinSubCategory(data)
            const query=await generateDeleteSubCategoryQuery(data)
            const result = await categoryModel.findByIdAndDelete(id)
            if (result)
                return result
        }

        return null
    } catch (error) {
        console.log(`deleteCategory error (Service)${error}`);
        return false
    }
}
const deleteCategory = async (
    id
) => {
    try {
        console.log(`ID la ${id}`);
        const category = await categoryModel.findOne({ _id: id })
        if (category) {
            await deleteImageinCategory(category)

            const result = await categoryModel.findByIdAndDelete(id)
            if (result)
                return result
        }

        return null
    } catch (error) {
        console.log(`deleteCategory error (Service)${error}`);
        return false
    }
}
module.exports = { deleteAnItemSubcategory,addCategory, getAllCategory, editCategory, deleteCategory }