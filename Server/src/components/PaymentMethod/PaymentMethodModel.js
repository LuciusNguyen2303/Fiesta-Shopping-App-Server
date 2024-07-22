const mongoose= require('mongoose')
const Schema = mongoose.Schema;
const ObjectId= Schema.ObjectId;

const PaymentMethodSchema= new Schema({
    userId:{type:ObjectId, ref:'users',required:true},
    defaultCard:{type:String,required:true},
    customerId:{type:String,required:true}
})

module.exports= mongoose.model("PaymentMethods",PaymentMethodSchema)|| mongoose.models.PaymentMethods