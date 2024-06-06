const categoryModel = require("./categoryModel");


const addCategory = async (
    data
) => {
    try {
        console.log(data);

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
const editCategory = async (
    id, updateData
) => {
    try {
        const result = await categoryModel.findByIdAndUpdate(id, updateData, { new: true })
        if (result)
            return result
        return null
            ;
    } catch (error) {
        console.log(`Editing new category error (Service)${error}`);
    }
}
const deleteCategory = async (
    id
) => {
    try {
        console.log(`ID la ${id}`);
        const result = await categoryModel.findByIdAndDelete(id)
        if (result)
            return result
        return null
    } catch (error) {
        console.log(`Editing new category error (Service)${error}`);
    }
}
module.exports = { addCategory, getAllCategory, editCategory,deleteCategory }