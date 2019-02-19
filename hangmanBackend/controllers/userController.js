/* eslint-disable indent */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const mongoose = require('mongoose');
require('../models/User');

const User = mongoose.model('User');

exports.registerUser = function (req, res) {
   // console.log(req.body);
    var hashedPassword = bcrypt.hashSync(req.body.password, 10);
    User.find({
        username: req.body.username
    }, function (err, dbRes) {
        console.log(dbRes);
        if (dbRes[0]) {
            console.log(dbRes);
            return res.status(200).send({
                msg: 'Username already taken, please choose another one.'
            })
        } else {
            User.create({
                    username: req.body.username,
                    password: hashedPassword,
                    isAdmin: false,
                },
                function (err, user) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send({
                            msg: 'There was a problem registering the user.'
                        })
                    }
                    // create a token
                    let token = jwt.sign({
                        username: user.username,
                        isAdmin: user.isAdmin
                    }, config.secret, {
                        expiresIn: 86400 // expires in 24 hours
                    });
                    res.status(200).send({
                        auth: true,
                        token: token,
                        msg: 'Account created'
                    });
                });
        }
    });


}

exports.authenticateUser = function (req, res) {
  //  console.log(req.body);
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        if (!user) {
            return res.status(400).send('No user found.');
        }
        let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({
                auth: false,
                token: null
            });
        }
        let token = jwt.sign({
            username: user.username,
            isAdmin: user.isAdmin
        }, config.secret, {
            expiresIn: 86400 * 7 // expires in 24 hours *7 aka 1 week
        });
        res.status(200).send({
            auth: true,
            token: token
        });
    });
}

exports.changePassword = function (req, res) {
    //  console.log(req.body);
      User.findOne({
          username: req.body.username
      }, function (err, user) {
          if (err) {
              return res.status(500).send('Error on the server.');
          }
          if (!user) {
              return res.status(400).send('No user found.');
          }
          let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
          if (!passwordIsValid) {
              return res.status(401).send({
                  auth: false,
                  token: null
              });
          }
          // user identity confirmed proceed with password change
          var hashedPassword = bcrypt.hashSync(req.body.newPassword, 10);
          User.updateOne({
            "username": req.body.username
        }, {
            $set: {
                "password": hashedPassword
            }
        }, {
            upsert: false
        },
        function (err, dbRes) {
            if (err) console.log(err);
            console.log(dbRes);
            res.status(200).send({
                msg: 'Password changed'
            });
        });
      });
  }