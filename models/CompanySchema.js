const mongoose =require('mongoose');
const companySchema =  new mongoose.Schema({
    Companyname: { type: String, require: true },
    phone: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    isVerified: { type: Boolean, default: false },
    adminVerification: { type: Boolean, default: false }
},{timestamps:true});

const companyModel =mongoose.model('companys',companySchema)
module.exports =companyModel;