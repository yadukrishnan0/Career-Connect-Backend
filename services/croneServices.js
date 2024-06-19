const Cron =require('node-cron');
const userModel =require('../models/UserSchema');

//automaticall deleted not verifed(otp verification) users signup after 30 days 
const task =async()=>{
    try{
     const expiryDay =new Date (Date.now() -30* 24* 60* 60* 1000);
     const DeleteDocs =await userModel.deleteMany({isVerified:false,createdAt:{$lt:expiryDay}});
    
    }catch(err){
        console.log(err)
    }
}
const init =()=>{
    Cron.schedule('0 0 * * *',task,{timezone:"UTC"})
}
module.exports ={init}


