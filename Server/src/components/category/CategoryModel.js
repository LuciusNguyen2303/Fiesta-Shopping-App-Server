const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const subcategorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
});
const categorySchema = new Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    subCategory: {
        type: [subcategorySchema]
    }
});
module.exports = mongoose.models.categories || mongoose.model("categories", categorySchema)