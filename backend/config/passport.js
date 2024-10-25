const { ExtractJwt, Strategy } = require("passport-jwt");
const db = require("./db");

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

module.exports = (passport) => {
  passport.use(
    new Strategy(opts, (jwt_payload, done) => {
      db.query(
        "SELECT * FROM users WHERE id = ?",
        [jwt_payload.id],
        (err, results) => {
          if (err) return done(err, false);
          if (results.length) {
            return done(null, results[0]);
          } else {
            return done(null, false);
          }
        }
      );
    })
  );
};
