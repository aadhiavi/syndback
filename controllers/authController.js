const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { generateOtp, sendOtp } = require('../utils/otp');
const { sendOtpEmail, sendWelcomeEmail } = require('../config/mailer');

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        const otp = generateOtp();
        newUser.otp = otp;
        newUser.otpExpires = Date.now() + 600000;
        await newUser.save();

        await sendOtpEmail(email, otp);

        res.status(201).json({ message: 'Account created. Please verify your email with OTP.' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) return res.status(400).json({ message: 'Invalid credentials' });

        if (!user.isVerified) return res.status(400).json({ message: 'Please verify your email first' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000;
        await user.save();
        await sendOtp(email, otp);

        res.status(200).json({ message: 'OTP sent to your email for password reset' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify OTP for account verification or password reset
const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (user.otpExpires < Date.now()) return res.status(400).json({ message: 'OTP expired' });

        if (!user.isVerified) {
            user.isVerified = true;
            await user.save();

            if (!user.welcomeEmailSent) {
                await sendWelcomeEmail(user.email, user.name);
                user.welcomeEmailSent = true;
                await user.save();
            }
        }
        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: 'Email verified successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Resend OTP
const resendOtp = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 600000;
        await user.save();
        await sendOtp(email, otp);

        res.status(200).json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Reset Password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });
        if (user.otpExpires < Date.now()) return res.status(400).json({ message: 'OTP expired' });

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedPassword;

        user.otp = null;
        user.otpExpires = null;
        await user.save();

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' }); 
    }
};

// Get User Details (name and email)
const getUser = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('name email');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({
            name: user.name,
            email: user.email,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = { registerUser, loginUser, forgotPassword, verifyOtp, resendOtp, resetPassword, getUser };

