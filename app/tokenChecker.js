const jwt = require('jsonwebtoken');
const ObjectId = require('mongoose').Types.ObjectId

const tokenBlackList = new Set();

const tokenChecker = function (req, res, next) {
    
    // const token = req.body.token || req.query.token || req.headers['authorization'] || req.headers['x-access-token'];
    const token = req.body.token || req.query.token || req.headers['authorization'].split(" ").pop() || req.headers['x-access-token']; 

    if(!token) return res.status(400).json({
        success: false,
        error: 'Token mancante'
    })


    jwt.verify(token,process.env.JWT_SECRET, (err,decoded) => {
        if(err) return res.status(401).json({
            success: false,
            error: "Token non valido"
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