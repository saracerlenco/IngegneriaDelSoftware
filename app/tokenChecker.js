const jwt = require('jsonwebtoken');

const tokenBlackList = new Set();

const tokenChecker = function (req, res, next) {
    
    var token = req.body.token || req.query.token || req.headers['authorization'];
    //var token = req.headers.authorization?.split(' ')[1];

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

        if(tokenBlackList.has(token)){
            return res.status(401).json({ error: "Token revocato"})
        }
        
        req.loggedUser = decoded;
        next();
    });
};

function revoke(token){
    tokenBlackList.add(token);
    console.log("token revocato " + token);
}

module.exports = { tokenChecker, revoke };