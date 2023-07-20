const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    publish: Boolean
});
module.exports = mongoose.model('Course', CourseSchema);