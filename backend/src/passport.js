import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "./models/user.model.js";

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

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/users/auth/google/callback",
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        } else {
          // Check if a user with this email already exists
          const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "";
          
          if (email) {
            user = await User.findOne({ email });
            if (user) {
              // If user exists, link Google ID
              user.googleId = profile.id;
              await user.save();
              return done(null, user);
            }
          }
          
          const fullName = profile.displayName;
          const avatar = profile.photos && profile.photos.length > 0 ? profile.photos[0].value : "";
          let username = email ? email.split("@")[0].toLowerCase() : `user${profile.id}`;

          // Avoid duplicate usernames
          let existingUser = await User.findOne({ username });
          if (existingUser) {
             username = `${username}${Math.floor(Math.random() * 1000)}`;
          }

          // Create new user
          const newUser = new User({
            googleId: profile.id,
            email: email,
            fullName: fullName,
            username: username,
            avatar: avatar,
          });

          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        console.error("Error in Google Strategy:", err);
        return done(err, null);
      }
    }
  )
);
