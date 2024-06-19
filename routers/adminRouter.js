const express = require('express')
const router =express.Router();
const adminController =require('../controllers/AdminController')

router.post('/admin/signup',adminController.AdminSignuPPost)//admin signup
router.post('/admin/otp',adminController.adminOtpVerification)//admin otp verification 
router.get('/admin/companyverification',adminController.companyVerificationGet)//verification company datas get
router.put('/admin/companyverification',adminController.companyVerification)
module.exports =router;       