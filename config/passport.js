const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/GoogleUser');
const dotenv = require('dotenv');
const { sendWelcomeEmailGoogle } = require('./mailer');
dotenv.config();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://syndback.onrender.com/api/auth/google/callback',
},
  async (token, tokenSecret, profile, done) => {
    try {
      const user = await User.findOne({ googleId: profile.id });

      if (user) {
        return done(null, user);
      }
      const newUser = new User({
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        email: profile.emails[0].value,
        imageUrl: profile.photos[0].value
      });

      await newUser.save();
      sendWelcomeEmailGoogle(newUser.email, newUser.displayName)
      return done(null, newUser); 
    } catch (error) {
      return done(error, false);
    }
  }
));


