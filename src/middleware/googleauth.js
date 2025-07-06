const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user/user.model");


passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});


passport.use(
    new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL 
    }, 
    async (accessToken, refreshToken, profile, done) => {

        //check if user exist in db 
        try {
            const existingUser = await User.findOne({ googleId: profile.id });
            if (existingUser) {
             
              done(null, existingUser);  // user exist


            } else {

                //if not, create user
              const user = await new User({
                googleId: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                profilePicture: profile.photos[0].value,
              }).save().then((user)=> {
                console.log("User created successfully");
                done(null, user);
              })
            }
          } catch (error) {
            console.log(error); 
          }


    })


);