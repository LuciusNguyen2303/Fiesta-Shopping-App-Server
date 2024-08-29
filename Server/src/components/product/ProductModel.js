const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId

const type = {
    single: "SINGLE",
    multiple: "MULTIPLE"
}
const image = new Schema({
    id: { type: String },
    url: { type: String },
    _id: false
})
const variations = new Schema({

    dimension: { type: Object, required: true },
    subImage: image,
    // dimensions decribes size, color, fire retardant,... etc fully .
    type: {
        type: String,
        enum: [type.single, type.multiple], // Chỉ chấp nhận 'singleChoice' hoặc 'multipleChoice'
        required: true // Đảm bảo trường này là bắt buộc
    },
    SKU: { type: String },
    price: { type: Number },
    stock: { type: Number }
})



const productSchema = new Schema({
    category: {
        type: Map,
        of: {
            type:
            {
                type: String,
                ref: "categories"
            }

        }
    },
    /* 
    json của category này là dạng 
    {
        Đây là json cha...
         category:{
            "mainCategory":"Một objectId",
            "subCategory":"Một objectId",
        }

    }
    
    
    
    */
    images: { type: [image] },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },
    Description: { type: String },
    Brand: { type: String },
    variations: [variations],
    isHidden: { type: Boolean, default: false },
    createAt: {type: Date, default: Date.now}
});
productSchema.index({
    _id: 1,
    'variations._id': 1,
    'variations.price': 1,
    'variations.dimension': 1,
    'variations.stock': 1,
    'hidden': 1,
    'name': 1
});



module.exports = mongoose.models.products || mongoose.model('products', productSchema)