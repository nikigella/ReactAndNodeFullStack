// Gives express an idea of how to handle authentication
const passport = require('passport');
// Authenticate users on google oauth
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// Generate and send back a cookie value after user logs in 
// provided that they have gotten back a google profile from the oauth flow
// Arguments - 1. User model, 2. done -> callback function
// user.id is NOT the profile.id but it's the id assigned by mongo
passport.serializeUser((user, done) => {
    done(null, user.id);
});


// Take the cookie value from the user's request and then 
// turn it back into a user model and then send back the posts
// from the database the user requested for

// This function is for a user who makes several requests after
// they sign in for the first time
passport.deserializeUser((id, done) => {
    // Pass in the id of the record we want to find into this function
    User.findById(id)
        .then(user => {
            done(null, user);
        })
});

// new GoogleStrategy() -> New instance of google strategy
// passport.use -> ordering passport to make aware that there 
// is a way to authenticate users via google provider
passport.use(
    new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: '/auth/google/callback'
    }, 
        (accessToken, refreshToken, profile, done) => {
           
            
            // Look through the users collection and find the first record
            // inside that collection with google id same as profile id returned
            // by oauth process
            // This returns a promise and it doesn't return the user immediately
            User.findOne({ googleId: profile.id })
                .then((existingUser) => {
                    if (existingUser) {
                        // we already have a record with given profile id
                        done(null, existingUser);
                    } else {
                        // we don't have a user record with this ID, make a new record
                         
                        // use model class to create a new instance of a user
                        new User({ googleId: profile.id})
                        // save() -> it'll take the model instance and save it to the database
                        // and it's also an asynchronous operation
                            .save()
                            .then(user => done(null, user));
                    }
                })
        }
    )
);

