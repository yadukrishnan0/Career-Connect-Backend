const express =require('express');
const router =express.Router();
const userController =require('../controllers/UserController');



router.post('/signup',userController.userSignupPost);
router.post('/otp',userController.OtpPost)
module.exports =router;