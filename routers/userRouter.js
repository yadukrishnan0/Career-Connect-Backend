const express =require('express');
const router =express.Router();
const userController =require('../controllers/UserController');
const multer =require('multer')
const{storage} =require('.././middleware/multer')
const upload =multer({storage})

router.post('/signup',userController.userSignupPost);//user or company signup
router.post('/otpsignup',userController.OtpPost)//otp verification
router.post('/companydocuments',upload.single('logo'),userController.companyDocumentsPost)//company  documents sumbition

module.exports =router;