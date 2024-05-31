const mongoose =require('mongoose');
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
},{timestamps:true});

const usersModel = mongoose.model('users',userSchema);
module.exports = usersModel;