const mongoose = require("mongoose");
const applicationSchema = mongoose.Schema(
  {
    companyId: { type: String, required: true },
    jobId: { type: mongoose.Types.ObjectId, ref: "jobs" },
    applications: [
      {
        userId: { type: mongoose.Types.ObjectId, ref:"users"},
        education: { type: String, required: true },
        experience: { type: String, required: true },
        company: { type: String, required: true },
        location: { type: String, required: true },
        skill: { type: Array, required: true },
        language: { type: Array, required: true },
        resume: { type: String, required: true },
        shortlist: { type: Boolean, default: false },
        applyDate:{type:Date,default:Date.now}
      },
    ],
  },
  { timestamps: true }
);

const applicationModel = mongoose.model("jobapplication", applicationSchema);
module.exports = applicationModel;
