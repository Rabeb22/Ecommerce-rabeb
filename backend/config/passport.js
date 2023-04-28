const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GithubStrategy = require('passport-github2').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const passport = require('passport');

// import GoogleStrategy from 'passport-google-oauth20';
// import GithubStrategy from 'passport-github2';
// import FacebookStrategy from 'passport-facebook';
// import passport from 'passport';

const GOOGLE_CLIENT_ID =
  '106244903649-ns7u14han8g6a3pjh7um6gg0m09v74br.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

const GITHUB_CLIENT_ID = 'your id';
const GITHUB_CLIENT_SECRET = 'your id';

const FACEBOOK_APP_ID = '936756484136541';
const FACEBOOK_APP_SECRET = 'b783f5367655d71d58ab1cccb08d79f1';

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:5000/api/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: '/auth/github/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: '/auth/facebook/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

