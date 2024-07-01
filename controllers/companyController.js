const path = require('path'); // Import the path module

const jobModel = require("../models/jobSchema");
const applicationModel = require("../models/applicationModel");

module.exports = {
  postJob: async (req, res, next) => {
    try {
      //req.body = job details//
      const { userId } = req.user;
      req.body.companyId = userId; // Add companyId to the request body
      const newJob = new jobModel(req.body);
      // Validate and save the new job
      await newJob.save();
      res
        .status(201)
        .json({ success: true, message: "Job posted successfully" });
    } catch (error) {
      next(error);
    }
  },
  applicationGet: async (req, res, next) => {
    try {
      const { userId } = req.user;
      const jobapplications = await applicationModel
        .find({ companyId: userId })
        .populate("jobId");
      res.status(200).json({ message: "ok", jobapplications });
    } catch (error) {
      console.log(error);
    }
  },
  candidateGet: async (req, res, next) => {
    try {
      const jobId = req.query.jobId;
      const CanditesData = await applicationModel.findOne({ jobId: jobId }).populate('applications.userId');
      res.status(200).json({message:'success',CanditesData})
    } catch (err) {
        next(err)
    }
  },
  resumeGet:(req, res) => {
    try {
      const filePath = path.join(__dirname, '../public/assets', req.query.resume); 
      res.sendFile(filePath);
    } catch (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error downloading file');
    }
  }
};
