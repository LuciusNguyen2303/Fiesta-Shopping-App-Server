const verificationService = require("./VerificationCodeService")
const saveVerificationController = async (userId, verificationCode) => {
    try {
        if (!userId)
            throw new Error("No userId available")
        if (!verificationCode)
            throw new Error("No verification code")
        return verificationService.saveVerificationCode(userId, verificationCode)
    } catch (error) {
        console.log("save verification (controller) error: ",error);
        return false
    }
}
const checkVerificationController = async (userId, verificationCode) => {
    try {
        if (!userId)
            throw new Error("No userId available")
        if (!verificationCode)
            throw new Error("No verification code")
        return verificationService.checkVerificationCode(userId, verificationCode)

    } catch (error) {
        console.log("Check verification (controller) error: ",error);
        return null
    }
}
module.exports = { checkVerificationController, saveVerificationController }