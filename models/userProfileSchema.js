const mongoose =require('mongoose');
const userProfileSchema = mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref:"users"},
    education:{type:String,required: true },
    experience:{type:String},
    company:{type:String,},
    location:{type:String,required: true },
    dob:{type:String,required: true },
    skill:{type:Array,required: true },
    language:{type:Array,required: true }

})

const userProfileModel =mongoose.model('userProfile',userProfileSchema);
module.exports = userProfileModel;