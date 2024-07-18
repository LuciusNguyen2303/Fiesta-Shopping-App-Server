const CustomError = require("../../HandleError");
const PaymentMethodModel = require("./PaymentMethodModel")

const insertPaymentMethod = async (addFields) => {
    try {
        const check = await PaymentMethodModel.exists({ userId: addFields.userId })
        if (!check)
            throw new CustomError("Already has the payment method for the user id!!!")
        const newPaymentMethod = new PaymentMethodModel(addFields);
        const result = await newPaymentMethod.save();
        return result ? result : null
    } catch (error) {
        console.log("ERROR INSERT PAYMENT METHOD: ", error);
        return null
    }
}
const updatePaymentMethod = async (updateFields) => {
    try {

        const result = await PaymentMethodModel.findOneAndUpdate({ userId: updateFields.userId }, updateFields, { new: true })
        return result ? result : null
    } catch (error) {
        console.log("ERROR INSERT PAYMENT METHOD: ", error);
        return null
    }
}
const getDefaultPaymentMethod = async (userId) => {
    try {

        const result = await PaymentMethodModel.findOne({ userId:userId })
        return result ? result : null
    } catch (error) {
        console.log("ERROR INSERT PAYMENT METHOD: ", error);
        return null
    }
}
const deletePaymentMethod = async (userId) => {
    try {

        const result = await PaymentMethodModel.findOneAndDelete({ userId:userId })
        return result ? result : null
    } catch (error) {
        console.log("ERROR INSERT PAYMENT METHOD: ", error);
        return null
    }
}
module.exports = { deletePaymentMethod,insertPaymentMethod, updatePaymentMethod,getDefaultPaymentMethod }