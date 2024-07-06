const mongoose = require("mongoose");

const userProfileSchema = mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  education: { type: String, required: true },
  institution: { type: String, required: true },
  dob: { type: String, required: true },
  experience: {
    type: [
      {
        company: { type: String },
        location: { type: String },
        experience: { type: String },
        jobrole:{type:String},
        startdate:{type:String},
        enddate:{type:String}
      },
    ],
    default: [],
  },
  skill:{ type: Array, required: true },
  language: { type:Array ,required:true },
});

const userProfileModel = mongoose.model("userProfile", userProfileSchema);
module.exports = userProfileModel;
