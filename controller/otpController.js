const nodemailer = require("nodemailer");
const User = require("../models/userModel");

let otp = Math.floor(Math.random() * 9000 + 1000);
let email;

const transporter = nodemailer.createTransport({
  service: "gmail",

  auth: {
    user: "dikshakpoudel34@gmail.com",
    pass: "lvslpiajqzxyguoi",
  },
});

const sendOtp = (req, res) => {
  email = req.user.email;

  const mailOptions = {
    from: "dikshakpoudel34@gmail.com",
    to: email,
    subject: "OTP for registration in OwnFreelance",
    html: `<h3>OTP for email <b>${email}</b> is <b>${otp}</b></h3>`,
  };

  transporter.sendMail(mailOptions, (err, _info) => {
    if (err) {
      return res.send({ msg: "Error while sending OTP code." });
    }
  });

  res.send("OTP sent to email successfully!");
};

const verifyOtp = async (req, res) => {
  if (req.body.otp === otp) {
    const { id } = req.user;

    await User.findByIdAndUpdate(id, { verified: true });

    res.send({ verified: true, msg: "OTP verification successful!" });
  } else {
    res.send({ verified: false, msg: "Your otp is incorrect!" });
  }
};

const resendOtp = (req, res) => {
  const mailOptions = {
    from: "dikshakpoudel34@gmail.com",
    to: req.user.email,
    subject: "OTP for registration in OwnFreelance",
    html: `<h3>OTP for email <b>${email}</b> is <b>${otp}</b></h3>`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return console.log(err);
    }

    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  });
};

module.exports = { sendOtp, verifyOtp, resendOtp };
