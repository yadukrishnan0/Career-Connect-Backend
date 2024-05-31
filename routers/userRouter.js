const express =require('express');
const router =express.Router();
const userController =require('../controllers/UserController');



router.post('/signup',userController.userSignupPost);
router.post('/otpsignup',userController.OtpPost)
router.post('/companydocuments',userController.companyDocumentsPost)

module.exports =router;