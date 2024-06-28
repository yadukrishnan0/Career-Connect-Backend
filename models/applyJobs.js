const mongoose =require('mongoose');
const applyJobsSchema = mongoose.Schema({
    userId:{type:String,requried:true},
    jobs:[{jobId:{ type: mongoose.Types.ObjectId, ref: "jobs" }}]
})
const applyJobsModel =mongoose.model('Applyjobs',applyJobsSchema);
module.exports =applyJobsModel;