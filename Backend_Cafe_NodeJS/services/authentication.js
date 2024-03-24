require('dotenv').config()      //dotenv required bcoz to encrypt and decrypt the token we are going to use the same ACCESS TOKEN
const jwt = require('jsonwebtoken');

function authenticateToken(req,res,next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null)
        return res.sendStatus(401);

    jwt.verify(token,process.env.ACCESS_TOKEN,(err,response)=>{     //checking if the token is signed by the particular ACCESS-TOKEN
        if (err){
            // console.log("That's my token: " + response.token);
            return res.sendStatus(403);     //forbidden access
        }
            res.locals = response;
        next()
    })
}

module.exports = {authenticateToken: authenticateToken}