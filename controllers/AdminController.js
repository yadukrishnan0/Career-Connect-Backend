const validation = require("../utilities/validation");
const adminModel = require("../models/AdminSchema");
const bcrypt = require("bcrypt");
const sendmail = require("../utilities/nodemailer");
const companyDocumentsModel = require("../models/companyRegistrationSchema");
const companyModel = require("../models/CompanySchema");
const verificationMail =require('../utilities/verificationMail')
module.exports = {
  AdminSignuPPost: async (req, res, next) => {
    try {
      const { name, email, phone, secretCode, password, ConfirmPassword } =
        req.body;
      const adminsecretCode = process.env.SECRET_CODE; // verification code for admin
      const adminExist = await adminModel.findOne({ email: email });

      // Check if admin already exists
      if (adminExist) {
        return res.status(400).json({ message: "User already signed up" });
      }

      // Validate required fields
      if (
        !validation.validationFields([
          name,
          email,
          phone,
          password,
          ConfirmPassword,
        ])
      ) {
        return res.status(400).json({ message: "Please fill the form" });
      }

      // Validate password
      if (!validation.passwordValidation(password)) {
        return res.status(400).json({ message: "Invalid password format" });
      }

      // Validate email
      if (!validation.emailValidation(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      // Check if password and confirm password match
      if (!validation.ConfirmPassword(password, ConfirmPassword)) {
        return res
          .status(400)
          .json({ message: "Password and confirm password do not match" });
      }

      // Verify admin secret code
      if (adminsecretCode !== secretCode) {
        return res.status(400).json({ message: "Incorrect secret code" });
      }

      // Create and save new admin
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = new adminModel({
        name,
        email,
        phone,
        password: hashedPassword,
      });
      await newAdmin.save();
      const generateOTP = Math.floor(1000 + Math.random() * 9000);
      req.session.adminemail = email;
      req.session.adminotp = generateOTP;
      await sendmail(email, generateOTP);
      return res
        .status(201)
        .json({ success: true, message: "Admin successfully signed up" });
    } catch (err) {
      next(err);
    }
  },
  adminOtpVerification: async (req, res, next) => {
    try {
      // Extract the individual OTP digits from the request body
      const { otp1, otp2, otp3, otp4 } = req.body;

      // Combine the 4 OTP digits into a single number
      let Enteropt = Number(otp1 + otp2 + otp3 + otp4);

      // Retrieve the sent OTP and admin email from the session
      const sendOtp = req.session.adminotp;
      const email = req.session.adminemail;

      // Check if the entered OTP matches the sent OTP
      if (Enteropt == sendOtp) {
        // Find the admin with the given email
        const exisistAdmin = await adminModel.findOne({ email: email });

        // If the admin exists, update the 'isVerified' status to true
        if (exisistAdmin) {
          await adminModel.updateOne(
            { email: email },
            { $set: { isVerified: true } }
          );
          // Respond with success message if OTP is verified
          return res
            .status(200)
            .json({ success: true, message: "otp verified" });
        }
      } else {
        // Respond with an error message if OTP is incorrect
        return res
          .status(400)
          .json({ success: false, message: "incorrect otp" });
      }
    } catch (err) {
      // Pass any errors to the next middleware
      next(err);
    }
  },
  Adminlogin: async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const accExist = await adminModel.findOne({ email: email });
      const passmatch = await bcrypt.compare(password, accExist.password);
      if (!accExist) {
        return res
          .status(400)
          .json({ success: false, message: "please create account" });
      }
      if (accExist && !passmatch) {
        return res
          .status(400)
          .json({ success: false, message: "incorrect password" });
      }
      if (accExist && passmatch) {
      }
    } catch (err) {
      next(err);
    }
  },
  companyVerificationGet: async (req, res, next) => {
    try {
      const companyDatas = await companyDocumentsModel.find({}).populate({
        path: "companyId",
        select: "-password", // Exclude the password field
      });
      res.status(200).json({ success: true, companyDatas: companyDatas });
    } catch (err) {
      next(err);
    }
  },
  companyVerification: async (req, res, next) => {
    try {
       const id = req.query.id;
       const result = await companyModel.findOneAndUpdate(
        { _id: id },
        { $set: { adminVerification: true } },
        { new: true } // This option returns the updated document
    );
    await verificationMail(result.email)
      res.status(200).json({ success: true, message: "Company documents are verified" });
    } catch (error) {
      next(error);
    }
  },
};
