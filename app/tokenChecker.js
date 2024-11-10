const jwt = require('jsonwebtoken');

const tokenChecker = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(!token) res.status(401).json({
        success: false,
        message: 'Token inesistente'
    })

    jwt.verify(token,process.env.JWT_SECRET, function(err,decoded) {
        if(err) res.status(403).json({
            fuccess: false,
            message: "Token non valido"
        }); 
        else {
            req.loggedUser = decoded;
            next();
        }
    });
};

module.exports = tokenChecker;