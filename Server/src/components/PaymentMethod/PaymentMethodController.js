const CustomError = require("../../HandleError");
const PaymentMethodService = require("./PaymentMethodService")

const insertPaymentMethod = async (addFields) => {
    try {
        if (!addFields)
            throw new CustomError("Empty fields !!!")
        const set = new Set(Object.keys(addFields))
        
        if(!set.has("userId")&&!set.has("defaultCard"))
            throw new CustomError("Empty at least one field !!!")
        return await PaymentMethodService.insertPaymentMethod(addFields);
    } catch (error) {
        console.log("ERROR INSERT PAYMENT METHOD: ", error);
        return null
    }
}
const updatePaymentMethod = async (updateFields) => {
    try {
        const set = new Set(Object.keys(updateFields))
        console.log(set);
        if(!set.has("userId")&&!set.has("defaultCard"))
            throw new CustomError("Empty at least one field !!!")
        return await PaymentMethodService.updatePaymentMethod(updateFields)
    } catch (error) {
        console.log("ERROR UPDATE PAYMENT METHOD: ", error);
        return null
    }
}
const getDefaultPaymentMethod = async (userId) => {
    try {
        if(!userId)
            throw new CustomError("Empty userId !!!")
        return await PaymentMethodService.getDefaultPaymentMethod(userId)
    } catch (error) {
        console.log("ERROR GET DEFAULT PAYMENT METHOD: ", error);
        return null
    }
}
const deletePaymentMethod = async (userId) => {
    try {
        if(!userId)
            throw new CustomError("Empty userId !!!")
        return await PaymentMethodService.deletePaymentMethod(userId)
    } catch (error) {
        console.log("ERROR DELETE PAYMENT METHOD: ", error);
        return null
    }
}
module.exports = { deletePaymentMethod,insertPaymentMethod, updatePaymentMethod,getDefaultPaymentMethod }