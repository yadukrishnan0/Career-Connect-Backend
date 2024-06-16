const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const verifyToken = require('../middleware/jwtToken'); // verification jwt token

router.post('/company/jobpost',verifyToken,companyController.postJob);

module.exports = router;
