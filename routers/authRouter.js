const express =require('express');
const router =express.Router();
const authController =require('../controllers/authController');
const multer =require('multer')

const{storage} =require('../middleware/multer')
const upload =multer({storage})



router.post('/signup',authController.userSignupPost);//user or company signup
router.post('/otpsignup',authController.OtpPost)//otp verification
router.post('/companydocuments',upload.single('logo'),authController.companyDocumentsPost)//company  documents sumbition
router.post('/login',authController.loginPost)

module.exports =router;