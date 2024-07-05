const express =require('express');
const router =express.Router();
const multer =require('multer')

const{storage} =require('../middleware/multer')
const upload =multer({storage})

const userController =require('../controllers/userController');
const verifyToken =require('../middleware/jwtToken')
router.get('/',userController.homeGet);
router.get('/jobdetail',userController.jobDetails);
router.get('/profile',verifyToken,userController.profileGet)
router.post('/profile',verifyToken,userController.profilePost)

router.post('/application',verifyToken,upload.single('resume') ,userController.applicationPost);
router.get('/myjobs',userController.myjobsGet)//applyed jobs get saved jobs
router.get('/applyjob',verifyToken,userController.applyedjobsGet);
router.post('/updateskill',verifyToken, userController.updateSkill)
module.exports =router;