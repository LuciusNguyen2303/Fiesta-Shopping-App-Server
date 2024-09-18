const verificationCodeModel = require("./VerificationCodeModel")

const saveVerificationCode = async (userId,verificationCode)=>{
    try {
        const check =  await verificationCodeModel.findOneAndUpdate({userId:userId},{verificationCode:verificationCode})
        
        if(!check)
        {
           const newVerification= {
            userId :userId,
            verificationCode:verificationCode
           }
           const newVerificationModel = new verificationCodeModel(newVerification)
            await newVerificationModel.save()
           
        }
        
            return true
    } catch (error) {
        console.log("Error saving verificationCode: ",error);
        return false
    }
}
const checkVerificationCode = async (userId,verificationCode2)=>{
    try {
        const check = await verificationCodeModel.findOne({userId:userId})

        if(check){
            const {verificationCode} = check._doc
            await verificationCodeModel.findOneAndUpdate({userId:userId},{verificationCode:""})
            return verificationCode==verificationCode2
        }else{
            throw new Error("No verification code by userId")
        }
    } catch (error) {
        console.log("Error checking verificationCode: ",error);
        return null
    }
}
module.exports={saveVerificationCode,checkVerificationCode}