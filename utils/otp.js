const crypto = require('crypto');
const nodemailer = require('nodemailer');

const generateOtp = () => {
    return crypto.randomBytes(3).toString('hex');
};

const sendOtp = (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your OTP for Email Verification',
        text: `Your OTP is: ${otp}`
    };

    return transporter.sendMail(mailOptions);
};

module.exports = { generateOtp, sendOtp };
