const companyModel = require("../models/CompanySchema");
const jobModel = require("../models/jobSchema");
const companyDocumentsModel = require("../models/companyRegistrationSchema");
const userProfileModel = require("../models/userProfileSchema");
const usersModel = require("../models/UserSchema");
module.exports = {
  homeGet: async (req, res, next) => {
    try {
      const jobs = await jobModel.find().populate("companyId").exec();
      const companyDocuments = await companyDocumentsModel.find().exec();
      const jobData = jobs.map((job) => {
        const companyDoc = companyDocuments.find((doc) =>
          doc.companyId.equals(job.companyId._id)
        );
        return {
          ...job.toObject(),
          companyDocuments: companyDoc ? companyDoc.toObject() : null,
        };
      });

      res.status(200).json({ success: true, jobData });
    } catch (error) {
      next(error);
    }
  },
  jobDetails: async (req, res, next) => {
    try {
      const id = req.query.id;
      const jobs = await jobModel.findOne({ _id: id }).populate("companyId");
      const documents = await companyDocumentsModel.findOne({
        companyId: jobs.companyId._id,
      }); //find company documents
      const jobsObject = jobs.toObject();
      jobsObject.companyDocuments = documents;
      res.status(200).json({ success: true, jobsObject });
    } catch (error) {
      next(error);
    }
  },
  profileGet: async (req, res, next) => {
    try {
      const { userId } = req.user;
      const exisitUser =await usersModel.findOne({_id:userId});
      const profiledata = await userProfileModel.findOne({ userId:userId });
      res.status(200).json({success:true,profiledata,exisitUser})
    } catch (err) {
      next(err);
    }
  },





  profilePost: async (req, res, next) => {
    const { userId } = req.user;
    try {
      const {
        name,
        email,
        phone,
        education,
        experience,
        company,
        dob,
        location,
        skill,
        language,
      } = req.body;
      const newProfileData =new userProfileModel({
        userId:userId,
        education,
        experience,
        company,
        location,
        dob,
        skill,
        language
      })
      await newProfileData.save();
      res.status(201).json({success:true,message:'profile created succcess'})
    } catch (err) {
      console.log(err);
    }
  },
};
