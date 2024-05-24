const usersModel = require('../models/UserSchema');
const UsersModel = require('../models/UserSchema');
const validation =require('../utilities/validation');//validation for signup
const bcrypt =require('bcrypt')
module.exports={
    userSignupGet:(req,res)=>{
     try{
         res.status(200).send('users signup')
     }catch(err){
        console.log('userSignupGet error:',err)
     }
    },
    userSignupPost:async(req,res)=>{
      console.log(req.body)
        try{
          const{name,Companyname,email,phone,password,ConfirmPassword}=req.body;
          //user deails save 
          if(name){
          const exisistUser =await UsersModel.findOne({email:email});
          if(exisistUser){
            return res.status(400).json('user already exist')
          }else if(!validation.validationFields([name,email,phone,password,ConfirmPassword])){
            return res.status(400).json('please fill the form')
          }
           else if(!validation.passwordValidation(password)){
              return res.status(400).json('invalid password format')
          }else if(!validation.emailValidation(email)){
            return res.status(400).json('invalid email format')
          }else if(!validation.ConfirmPassword(password,ConfirmPassword)){
             return res.status(400).json('password and confirmpassword is not match')
          } else{
              const hashedPassword= await bcrypt.hash(password,10);
              const newUser = new usersModel({
                name,
                phone,
                email,
                password:hashedPassword
              })
              await newUser.save()
              res.status(200).json('user signupsuccessfully')
          }   
        }else{
          //company details save
        }

        }catch(err){
          console.log('userSignupPost err:',err)
        }
    }
}