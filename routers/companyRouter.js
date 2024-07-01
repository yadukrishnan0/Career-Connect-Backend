const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const verifyToken = require('../middleware/jwtToken'); // verification jwt token

router.post('/jobpost',verifyToken,companyController.postJob);
router.get('/application',verifyToken,companyController.applicationGet);
router.get('/viewCandidates',companyController.candidateGet);
router.get('/download',companyController.resumeGet)
module.exports = router;
