const mongoose = require("mongoose");
const applicationSchema = mongoose.Schema({
  companyId: { type: String, required: true },
  jobId: { type: String, required: true },
  applications: [
    {
      userId: { type: String, required: true },
      education: { type: String, required: true },
      experience: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String, required: true },
      skill: { type: Array, required: true },
      language: { type: Array, required: true },
      resume: { type: String, required: true },
    },
  ],
});

const applicationModel = mongoose.model("jobapplication", applicationSchema);
module.exports = applicationModel;
