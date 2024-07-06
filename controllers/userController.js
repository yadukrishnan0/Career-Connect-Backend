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
      });
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
      if (exisitUser && profiledata)
        return res.status(200).json({
          success: true,
          msg: "User have profile",
          profiledata,
          exisitUser,
        });
      else
        return res
          .status(404)
          .json({ success: false, msg: "profile not exist not exist" });
    } catch (err) {
      next(err);
    }
  },

  profilePost: async (req, res, next) => {
    const { userId } = req.user;
    console.log(req.body);
    try {
      const {
        education,
        experience,
        company,
        dob,
        location,
        skill,
        language,
        institution,
        jobrole,
        startdate,
        enddate
      } = req.body;

      // Creating a new profile instance
      const newProfileData = new userProfileModel({
        userId: userId,
        education,
        institution,
        experience: [
          {
            company: company,
            location: location,
            experience: experience,
            jobrole: jobrole,
            startdate: startdate,
            enddate: enddate,
          },
        ],
        dob,
        skill,
        language,
      });

      const profileDatas = await newProfileData.save();
      const exisitUser = await usersModel.findOne({ _id: userId });
      res.status(200).json({
        success: true,
        message: "Profile created successfully",
        profileDatas,
        exisitUser,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "An error occurred while creating the profile",
      });
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
  myjobsGet: async (req, res, next) => {
    const userId = "66750afad91791483f7a0b10";
    try {
      const applyJob = await applyjobModel
        .findOne({ userId })
        .populate({
          path: "jobs.jobId",
          populate: { path: "companyId" },
        })
        .exec();

      if (!applyJob) {
        console.log("No applied job found for this user");
        return res.status(404).send("No jobs found");
      }

      const companyDocuments = await companyDocumentsModel.find().exec();

      const jobData = applyJob.jobs.map((job) => {
        const companyDoc = companyDocuments.find((doc) =>
          doc.companyId.equals(job.jobId.companyId._id)
        );

        return {
          ...job.toObject(),
          companyDetails: job.jobId.companyId
            ? job.jobId.companyId.toObject()
            : null,
          companyDocuments: companyDoc ? companyDoc.toObject() : null,
        };
      });
      res.status(200).json({ success: true, jobData });
    } catch (err) {
      next(err);
    }
  },
  applyedjobsGet: async (req, res, next) => {
    try {
      const { userId } = req.user;
      const myjobData = await applyjobModel.findOne({ userId: userId });
      return res.status(200).json({ success: true, myjobData });
    } catch (err) {
      next(err);
    }
  },

  updateSkill: async (req, res, next) => {
    /// user add new skill   and delete skill
    try {
      const { userId } = req.user;
      const skill = req.query.skill;

      if (skill) {
        const updated = await userProfileModel.updateOne(
          { userId: userId },
          { $pull: { skill: { skill: skill } } }
        );

        return res
          .status(200)
          .json({ success: true, message: "Skill deleted success" });
      } else {
        const userProfile = await userProfileModel.findOne({ userId: userId });
        const skillExists = userProfile.skill.some(
          (s) => s.skill === req.body.skill
        ); // to check if the skill already exists

        if (skillExists) {
          return res
            .status(400)
            .json({ success: false, message: "Skill already exists" });
        }

        await userProfileModel.updateOne(
          { userId: userId },
          { $addToSet: { skill: { skill: req.body.skill } } }
        );

        return res.status(200).json({ message: "Skill update success" });
      }
    } catch (error) {
      next(error);
    }
  },
};
