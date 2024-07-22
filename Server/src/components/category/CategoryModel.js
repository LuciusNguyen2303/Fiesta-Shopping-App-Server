const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const image = new Schema({
    id: { type: String },
    url: { type: String },
    _id: false
})
const subcategorySchema = new Schema({
    name: { type: String, required: true },
    subImage: image,
});
const categorySchema = new Schema({
    name: { type: String, required: true },
    image: image,
    subCategory: [subcategorySchema]
});
module.exports = mongoose.models.categories || mongoose.model("categories", categorySchema)