const express = require('express');
const { registerUser, loginUser, forgotPassword, verifyOtp, resendOtp, resetPassword, getUser } = require('../controllers/authController');
const passport = require('passport');
const { authenticate } = require('../middleware/auth');
const router = express.Router();
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/resend-otp', resendOtp);
router.post('/reset-password', resetPassword);
router.get('/user-profile', authenticate, getUser);


router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

//login
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/',
  session: true
}), (req, res) => {
  res.redirect('http://localhost:5173/')
});

// logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/');
  });
});

//user photo data
router.get('/google-user', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('Unauthorized');
  }
  res.json(req.user);
});


module.exports = router;
