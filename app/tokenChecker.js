const jwt = require('jsonwebtoken');

const tokenChecker = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['authorization'];

    if(!token) return res.status(401).json({
        success: false,
        message: 'Token inesistente'
    })
    token = token.split(" ")[1];
    jwt.verify(token,process.env.JWT_SECRET, (err,decoded) => {
        if(err) return res.status(403).json({
            success: false,
            message: "Token non valido"
        }); 
        req.loggedUser = decoded;
        next();
    });
};

module.exports = tokenChecker;