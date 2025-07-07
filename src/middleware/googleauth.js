const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          console.log('Google user exists:', existingUser.email);
          return done(null, existingUser);
        }

        // Create a new user
        const newUser = await User.create({
          googleId: profile.id,
          firstName: profile.name?.givenName || 'Unknown',
          lastName: profile.name?.familyName || '',
          email: profile.emails[0].value,
          profileImage: profile.photos[0].value,
          isVerified: true, // Mark Google users as verified immediately
        });

        console.log('Created new Google user:', newUser.email);
        return done(null, newUser);
      } catch (error) {
        console.log('Error in GoogleStrategy:', error);
        return done(error, null);
      }
    }
  )
);

module.exports = passport;
