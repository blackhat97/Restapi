var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var Config = require('./config');
var Sequelize = require('sequelize');
const JwtStrategy = require('passport-jwt').Strategy,
  ExtractJwt = require('passport-jwt').ExtractJwt,
  Orm = require('../orm'),
  Op = Sequelize.Op;


module.exports = function(passport) {


  passport.use('admin-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    session: false,
  }, (email, password, done) => {

        var isValidPassword = function(password, hash) {
            return bcrypt.compareSync(password, hash);
        }

        Orm.Admins.findOne({
          where: {
            email: email,
          },
        }).then(user => {
          if (!user) {
            return done(null, false, { message: '해당되는 아이디가 없습니다.' });
          }
          if (!user.validPassword(password)) {
            return done(null, false, {
              message: '비밀번호가 일치하지 않습니다.'
            });
	  }

          var userinfo = user.get();
          return done(null, userinfo);

        }).catch(function(err) {
            return done(null, false, {
                message: '로그인 문제가 발생했습니다.'
            });

        });
    },
    ),
  );

  const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('bearer'),
    secretOrKey: Config.JWT_SECRET,
  };

  passport.use('jwt-admin',
    new JwtStrategy(opts, (jwt_payload, done) => {
      try {
        Orm.Admins.findOne({
          where: {
            username: jwt_payload.id,
         },
        }).then(user => {
          if (user) {
            done(null, user);
          } else {
            console.log('You are not an administrator.');
            done(null, false);
          }
        });
      } catch (err) {
        done(err);
      }
    }),
  );


};
