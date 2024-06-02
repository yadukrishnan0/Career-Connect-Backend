const validation = require("../utilities/validation");
const adminModel = require("../models/AdminSchema");
const bcrypt = require("bcrypt");
const sendmail = require("../utilities/nodemailer");
module.exports = {
  AdminSignuPPost: async (req, res, next) => {
    console.log(req.body);
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
};
