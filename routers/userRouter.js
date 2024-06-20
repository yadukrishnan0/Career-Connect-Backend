const express =require('express');
const router =express.Router();
const userController =require('../controllers/userController');

router.get('/',userController.homeGet);
router.get('/jobdetail',userController.jobDetails)
module.exports =router;