const express = require('express')
const router =express.Router();
const adminController =require('../controllers/AdminController')

router.post('/admin/signup',adminController.AdminSignuPPost)//admin signup

module.exports =router;