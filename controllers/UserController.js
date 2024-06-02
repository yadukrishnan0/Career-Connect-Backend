const UsersModel = require("../models/UserSchema");
const companyDocumentsModel = require("../models/companyRegistrationSchema");
const validation = require("../utilities/validation"); //validation for signup
const bcrypt = require("bcrypt");
const sendmail = require("../utilities/nodemailer");
const companyModel = require("../models/CompanySchema");
const usersModel = require("../models/UserSchema");

module.exports = {
  //user and company is registration
  userSignupPost: async (req, res, next) => {
    try {
      const { name, Companyname, email, phone, password, ConfirmPassword } =
        req.body;
      //user deails save
      if (name) {
        const exisistUser = await UsersModel.findOne({ email: email });
        const exisistCompany = await companyModel.findOne({ email: email });
        if (exisistUser || exisistCompany) {
          return res.status(400).json({ message: "user already signuped" });
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
            password:hashedPassword,
          });
          await newUser.save();
          const generateOTP = Math.floor(1000 + Math.random() * 9000);
          req.session.otp = generateOTP;
          req.session.email = email;
          await sendmail(email, generateOTP);

          res.status(201).json({
            success: true,
            messsage: "user  signupsuccessfully and otp send ",
            role: "employee",
          });
        }
      } else {
        // comapny details save
        const exisistCompany = await companyModel.findOne({ email: email });
        if (exisistCompany) {
          return res.status(400).json({ message: "user already exist" });
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
          res.status(201).json({
            success: true,
            msg: "company  signupsuccessfully and otp send ",
            role: "company",
          });
        }
      }
    } catch (err) {
      next(err);
    }
  },
  //otp verification
  OtpPost: async (req, res, next) => {

    try {
      const { otp1, otp2, otp3, otp4 } = req.body;

      let Enteropt = Number(otp1 + otp2 + otp3 + otp4); // 4 inputs are join

      const sendOtp = req.session.otp;
      const email = req.session.email;

      if (Enteropt == sendOtp) {
        const exisistCompany = await companyModel.findOne({ email: email });
        const exisistuser = await UsersModel.findOne({ email: email });
        if (exisistCompany) {
          await companyModel.updateOne(
            { email: email },
            { $set: { isVerified: true } } // verifing company and updating isVerified is ture
          );
          return res
            .status(200)
            .json({ success: true, message: "otp verified", role: "company" });
        } else if (exisistuser) {
          await UsersModel.updateOne(
            { email: email },
            { $set: { isVerified: true } } // verifing user and updating isVerified is ture
          );
          delete req.session.otp;
          delete req.session.email;
          return res
            .status(200)
            .json({ success: true, message: "otp verified", role: "employee" });
        }
      } else {
        return res.status(400).json({ message: "incorrect otp" });
      }
    } catch (err) {
      next(err);
    }
  },
  companyDocumentsPost: async (req, res, next) => {

    try {
      const { Registration_Number, Gst_Number, Sector, company_address } =
        req.body;
      const email = req.session.email;
      const company = await companyModel.findOne({ email: email });
      const companyDocuments = new companyDocumentsModel({
        companyId: company._id,
        Registration_Number,
        Gst_Number,
        Sector,
        company_address,
      });
      await companyDocuments.save();
      delete req.session.otp;
      delete req.session.email;
      res
        .status(200)
        .json({ success: true, message: "companyDocumentsPost is success" });
    } catch (err) {
      next(err);
    }
  },
};
