const express =require('express');
const router =express.Router();
const userController =require('../controllers/UserController');



router.post('/signup',userController.userSignupPost);//user or company signup
router.post('/otpsignup',userController.OtpPost)//otp verification
router.post('/companydocuments',userController.companyDocumentsPost)//company  documents sumbition

module.exports =router;