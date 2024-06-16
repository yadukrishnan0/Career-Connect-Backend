const jobModel = require('../models/jobSchema');

module.exports = {
    postJob: async (req, res, next) => {
        try {
            //req.body = job details//
            const { userId } = req.user;
            req.body.companyId = userId; // Add companyId to the request body
            const newJob = new jobModel(req.body);
             // Validate and save the new job
             await newJob.save();
            res.status(201).json({message: 'Job posted successfully',job: newJob});
        } catch (error) {
          next(error)
        }
    }
};
