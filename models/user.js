const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    password: String,
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }] 
});
module.exports = mongoose.model('User', UserSchema);