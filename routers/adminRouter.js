const express = require('express')
const router =express.Router();
const adminController =require('../controllers/AdminController')

router.post('/admin/signup',adminController.AdminSignuPPost)//admin signup
router.post('/admin/otp',adminController.adminOtpVerification)//admin otp verification 
router.get('/admin/companyverification',adminController.companyVerification)//verification company datas get
module.exports =router;