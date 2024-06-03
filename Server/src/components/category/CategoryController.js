const categoryService = require('./CategoryService');

const addCategory = async (
    data
) => {
    try {
        const image = data.image;
        const name = data.name;
        if (image && name) {
            const result = await categoryService.addCategory(data);
            if (result)
                return result;
        }
        console.log(`Lỗi name ${name} hoặc image ${image}. `);

        return null
    } catch (error) {
        console.log(`Adding new category error (Controller)${error}`);
    }
}
const getAllCategory = async () => {
    try {
        const result = await categoryService.getAllCategory();
        if (result)
            return result;
        return null

    } catch (error) {
        console.log(`Getting all category error (Controller)${error}`);
    }
}
const editCategory = async (
    id, image, name
) => {
    try {
        if (id && name && image) {
            const updateData = {
                image: data.image,
                name: data.name
            }
            const result = await categoryService.editCategory(id, updateData)
            if (result)
                return result
        }
        console.log(`Lỗi id ${id} hoặc name ${name} hoặc image ${image}. `);

        return null
    } catch (error) {
        console.log(`Editing new category error (Controller)${error}`);
    }
}
const deleteCategory = async (
    id
) => {
    try {

        const result = await categoryService.deleteCategory(id)
        if (result)
            return result

        console.log(`Lỗi delete: ${result}`);
        return null
    } catch (error) {
        console.log(`Editing new category error (Controller)${error}`);
    }
}
module.exports = { deleteCategory, addCategory, editCategory, getAllCategory }