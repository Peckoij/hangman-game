/* eslint-disable indent */
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
const mongoose = require('mongoose');
const User = mongoose.model('Users');

exports.registerUser = function (req, res) {
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
            username: req.body.username,
            password: hashedPassword,
            isAdmin: false,
        },
        function (err, user) {
            if (err) {
                console.log(err);
                return res.status(500).send('There was a problem registering the user.')
            }
            // create a token
            let token = jwt.sign({
                id: user._id,
                isAdmin: req.body.isAdmin
            }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({
                auth: true,
                token: token
            });
        });

}

exports.authenticateUser = function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err) {
            return res.status(500).send('Error on the server.');
        }
        if (!user) {
            return res.status(404).send('No user found.');
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
            isadmin: user.isadmin
        }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({
            auth: true,
            token: token
        });
    });
}