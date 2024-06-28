const companyModel = require("../models/CompanySchema");
const jobModel = require("../models/jobSchema");
const companyDocumentsModel = require("../models/companyRegistrationSchema");
const userProfileModel = require("../models/userProfileSchema");
const usersModel = require("../models/UserSchema");
const applicationModel = require("../models/applicationModel");
const applyjobModel = require("../models/applyJobs");
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
      const exisitUser = await usersModel.findOne({ _id: userId });
      const profiledata = await userProfileModel.findOne({ userId: userId });
      res.status(200).json({ success: true, profiledata, exisitUser });
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
      const newProfileData = new userProfileModel({
        userId: userId,
        education,
        experience,
        company,
        location,
        dob,
        skill,
        language,
      });
      await newProfileData.save();
      res
        .status(201)
        .json({ success: true, message: "profile created succcess" });
    } catch (err) {
      console.log(err);
    }
  },
  applicationPost: async (req, res, next) => {
    try {
      const { userId } = req.user;
      const education = JSON.parse(req.body.education);
      const experience = JSON.parse(req.body.experience);
      const company = JSON.parse(req.body.company);
      const skill = JSON.parse(req.body.skill);
      const language = JSON.parse(req.body.language);
      const location = JSON.parse(req.body.location);
      const jobId = JSON.parse(req.body.jobId);
      const Resume = req.file.filename;
      const jobdata = await jobModel.findOne({ _id: jobId });
      const applyJob = await applyjobModel.findOne({ userId: userId });
      const applictionJOb = await applicationModel.findOne({ jobId: jobId });
      if (!applictionJOb) {
        const newApplication = new applicationModel({
          companyId: jobdata.companyId,
          jobId: jobId,
          applications: [
            {
              userId: userId,
              education,
              experience,
              company,
              location,
              skill,
              language,
              resume: Resume,
            },
          ],
        });
        await newApplication.save();
      } else {
        await applicationModel.updateOne(
          { jobId: jobId },
          {
            $push: {
              applications: {
                userId: userId,
                education,
                experience,
                company,
                location,
                skill,
                language,
                resume: Resume,
              },
            },
          }
        );
      }
      if (!applyJob) {
        const newData = await applyjobModel({
          userId: userId,
          jobs: [{ jobId: jobId }],
        });
        await newData.save();
      } else {
        await applyjobModel.updateOne(
          { userId: userId },
          { $push: { jobs: { jobId: jobId } } }
        );
      }
      res.status(201).json({ message: "application successfully submit" });
    } catch (err) {
      next(err);
    }
  },
};
