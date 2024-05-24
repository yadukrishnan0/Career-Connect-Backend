const UsersModel = require("../models/UserSchema");
const validation = require("../utilities/validation"); //validation for signup
const bcrypt = require("bcrypt");
const sendmail = require("../utilities/nodemailer");
const companyModel = require("../models/CompanySchema");
module.exports = {
  userSignupPost: async (req, res) => {
    try {
      console.log(req.body);
      const { name, Companyname, email, phone, password, ConfirmPassword } =
        req.body;
      //user deails save
      if (name) {
        const exisistUser = await UsersModel.findOne({ email: email });
        if (exisistUser) {
          return res.status(400).json("user already exist");
        } else if (
          !validation.validationFields([
            name,
            email,
            phone,
            password,
            ConfirmPassword,
          ])
        ) {
          return res.status(400).json("please fill the form");
        } else if (!validation.passwordValidation(password)) {
          return res.status(400).json("invalid password format");
        } else if (!validation.emailValidation(email)) {
          return res.status(400).json("invalid email format");
        } else if (!validation.ConfirmPassword(password, ConfirmPassword)) {
          return res
            .status(400)
            .json("password and confirmpassword is not match");
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new UsersModel({
            name,
            phone,
            email,
            password: hashedPassword,
          });
          await newUser.save();
          const generateOTP = Math.floor(1000 + Math.random() * 9000);
          req.session.otp = generateOTP;
          req.session.email = email;
          await sendmail(email, generateOTP);
          res.status(200).json("user  signupsuccessfully and otp send ");
        }
      } else {
        // comapny details save
        const exisistCompany = await companyModel.findOne({ email: email });
        if (exisistCompany) {
          return res.status(400).json("user already exist");
        } else if (
          !validation.validationFields([
            Companyname,
            email,
            phone,
            password,
            ConfirmPassword,
          ])
        ) {
          return res.status(400).json("please fill the form");
        } else if (!validation.passwordValidation(password)) {
          return res.status(400).json("invalid password format");
        } else if (!validation.emailValidation(email)) {
          return res.status(400).json("invalid email format");
        } else if (!validation.ConfirmPassword(password, ConfirmPassword)) {
          return res
            .status(400)
            .json("password and confirmpassword is not match");
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          const newCompany = new companyModel({
            Companyname,
            phone,
            email,
            password: hashedPassword,
          });
          await newCompany.save();
          const generateOTP = Math.floor(1000 + Math.random() * 9000);
          req.session.otp = generateOTP;
          req.session.email = email;
          await sendmail(email, generateOTP);
          res.status(200).json("company  signupsuccessfully and otp send ");
        }
      }
    } catch (err) {
      console.log("userSignupPost err:", err);
    }
  },
  //otp verification
  OtpPost: async (req, res) => {
    try {
      const { otp1, otp2, otp3, otp4 } = req.body;

      let Enteropt = Number(otp1 + otp2 + otp3 + otp4); // 4 inputs are join
      let sendOtp = req.session.otp;
      let email = req.session.email;
  
      if (Enteropt == sendOtp) {
        const exisistCompany = await companyModel.updateOne({ email: email });
        const exisistuser =await UsersModel.updateOne({ email: email });
        console.log(exisistuser)
        if (exisistCompany) {
          await companyModel.updateOne(
            { email: email },
            { $set: { isVerified: true } }
          );
          return res.status(200).json("otp verified");
        } else if (exisistuser) {
          await UsersModel.updateOne(
            { email: email },
            { $set: { isVerified: true } }
          );
          return res.status(200).json("otp verified");
        }
      } else {
        return res.status(400).json("incorrect otp");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
