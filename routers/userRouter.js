const express =require('express');
const router =express.Router();
const userController =require('../controllers/userController');
const verifyToken =require('../middleware/jwtToken')
router.get('/',userController.homeGet);
router.get('/jobdetail',userController.jobDetails);
router.get('/profile',verifyToken,userController.profileGet)
router.post('/profile',verifyToken,userController.profilePost)
module.exports =router;