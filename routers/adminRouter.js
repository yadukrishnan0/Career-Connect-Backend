const express = require('express')
const router =express.Router();
const adminController =require('../controllers/AdminController')

router.post('/signup',adminController.AdminSignuPPost)//admin signup
router.post('/otp',adminController.adminOtpVerification)//admin otp verification 
router.get('/companyverification',adminController.companyVerificationGet)//verification company datas get
router.put('/companyverification',adminController.companyVerification)//update the company adminverification true

module.exports =router;       