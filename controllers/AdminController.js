const validation = require("../utilities/validation");
const adminModel = require("../models/AdminSchema");

module.exports = {
  AdminSignuPPost: async (req, res,next) => {
    try {

      const errResonse = (status,data) => {
        return res.status(status).json({data})
      }

      const { name, email, phone, secretCode, password } = req.body;
      const exisistadmin = await adminModel.findOne({ email: email });
      const adminsecretCode = process.env.SECRET_CODE; //verification code for admin
      if (exisistadmin) {
        errResonse(400,)
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
      } else if (adminsecretCode == secretCode) {
        return res.status(400).json("code in incorrect");
      } else {
        const newadmin = new adminModel({
          name,
          email,
          phone,
          password,
        });
        await newadmin.save();
        return res
          .status(200)
          .json({ success: true, message: "admin successfully signup" });
      }
    } catch (err) {
      next(err)
    }
  },
};
