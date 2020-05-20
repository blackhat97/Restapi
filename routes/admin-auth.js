var express = require('express'),
    routes = express.Router();
var jwt = require('jsonwebtoken');
var crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
var bcrypt = require('bcrypt');
var passport = require('passport');

routes.post('/login', (req, res, next) => {
    passport.authenticate('admin-login', {session: false}, (err, user, info) => {

      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user : user
        });
      }
      req.logIn(user, {session: false}, (err) => {
        if (err) {
          res.send(err);
        }
        const token = jwt.sign({ id: user.username }, Config.jwt_secret);

        return res.json({user, token});
      });
    })(req, res, next);
});

module.exports = routes;
