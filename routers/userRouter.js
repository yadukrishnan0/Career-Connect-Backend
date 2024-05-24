const express =require('express');
const router =express.Router();
const userController =require('../controllers/UserController');

router.get('/signup',userController.userSignupGet)

router.post('/signup',userController.userSignupPost)
  module.exports =router;