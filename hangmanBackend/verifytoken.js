const jwt = require('jsonwebtoken');
const config = require('./config');
const secret = config.secret;

exports.verifyToken = function (req, res, next) {
    const token = req.body.token || req.headers['x-access-token']
    if (!token) {
        return res.status(401).send({
            auth: false,
            message: 'No token provided.'
        });
    }

    jwt.verify(token, secret, function (err, decoded) {
        if (err) {
            console.log(err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });
        }

        return next();
    });
}