const mongoose = require("mongoose");
const jobShema = mongoose.Schema({
  companyId: { type: String, required: true },
  jobTitle: { type: String, required: true },
  tags: { type: String, required: true },
  jobrole: { type: String, required: true },
  minisalary: { type: String, required: true },
  maxsalary: { type: String, required: true },
  salaryType: { type: String, required: true },
  education: { type: String, required: true },
  experience: { type: String, required: true },
  jobType: { type: String, required: true },
  Works_Space_Type: { type: String, required: true },
  Vacancies: { type: String, required: true },
  date: { type: String, required: true },
});
const jobModel = mongoose.model('jobs',jobShema);
module.exports =jobModel;