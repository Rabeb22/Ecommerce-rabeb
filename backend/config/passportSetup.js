const passport = require('passport');
const dotenv = require('dotenv');
const User = require('../models/userModel.js');
const generateGravatar = require('../utils/generateGravatar.js');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;

// all passport strategies
// import GoogleStrategy from 'passport-google-oauth20';
// import GithubStrategy from 'passport-github2';
// import TwitterStrategy from 'passport-twitter';
// import LinkedInStrategy from 'passport-linkedin-oauth2';

// to use .env variables in this file
dotenv.config();
const backendURL = process.env.BACKEND_BASE_URL;

// Funtion to send a flash message depending on which social account the user had originally registered with
const handleAuthError = (err, done) => {
  // we get the email from the option the user is currently trying to login with, and find the corresponding User obj
  User.findOne({
    email: err.keyValue.email, // err obj returned from mongoose has the keyValue key
  }).then((user) => {
    // check which socialID was stored in this User obj, return the corresponding error in format
    // done(null, false, {flash message}) -> which tells passport not to serialise this user
    if (user.googleID)
      return done(null, false, {
        message: 'Registered using google account',
      });
    if (user.githubID)
      return done(null, false, {
        message: 'Registered using github account',
      });
    if (user.twitterID)
      return done(null, false, {
        message: 'Registered using twitter account',
      });
  });
};

// Include all passport strategies' setup in this function itself
const setupPassport = () => {
  // setup a session with the logged in user, by serialising this user is
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // end the current login session after deserialising the user
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .then((user) => done(null, user))
      .catch((err) => console.log(`${err}`.bgRed.bold));
  });

  // setup for the google strategy
  passport.use(
    new GoogleStrategy(
      {
        // options for the google strategy
        clientID: process.env.GOOGLE_OAUTH_CLIENT_ID,
        clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        callbackURL: `${backendURL}/api/auth/google/redirect`,
        // callbackURL: '/api/auth/google/callback',
        // scope: ['profile', 'email'],
      },
      (accessToken, refreshToken, profile, done) => {
        // if a user with this google ID is present, serialise that user, otherwise create a new User
        User.findOne({ email: profile._json.email }).then((foundUser) => {
          if (foundUser) {
            done(null, foundUser);
          }
        });
      }
    )
  );

  // setup for the facebook strategy
  passport.use(
    new FacebookStrategy(
      {
        // options for the google strategy
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: `${backendURL}/api/auth/facebook/redirect`,
        // callbackURL: '/api/auth/google/callback',
        // scope: ['profile', 'email'],
      },
      (accessToken, refreshToken, profile, done) => {
        // if a user with this google ID is present, serialise that user, otherwise create a new User
        User.findOne({ email: profile._json.email }).then((foundUser) => {
          if (foundUser) {
            done(null, foundUser);
          }
        });
      }
    )
  );

  // setup for the github strategy
  passport.use(
    new GithubStrategy(
      {
        // options for the github strategy
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${backendURL}/api/auth/github/redirect`,
      },
      (accessToken, refreshToken, profile, done) => {
        // if a user with this github ID is present, serialise that user, otherwise create a new User
        User.findOne({ email: profile._json.email }).then((foundUser) => {
          if (foundUser) {
            done(null, foundUser);
          }
        });
      }
    )
  );
};

// setup for the twitter strategy
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CONSUMER_KEY,
      consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: `${backendURL}/api/auth/twitter/redirect`,
      includeEmail: true,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({ twitterID: profile.id }).then((foundUser) => {
        if (!foundUser) {
          User.create({
            name: profile.displayName,
            isAdmin: false,
            isConfirmed: true,
            twitterID: profile.id,
            avatar: generateGravatar(profile._json.email),
            email: profile._json.email,
          })
            .then((user) => {
              done(null, user);
            })
            .catch((err) => {
              handleAuthError(err, done);
            });
        } else {
          done(null, foundUser);
        }
      });
    }
  )
);

module.exports = setupPassport;
