const jwt = require("jsonwebtoken");
//const AuthorModel = require("../authorModel/authorModel.js");
//const blogsmodel = require("../blogModel/blogModel.js");

const authenticate = function(req, res, next){
    try{
    let token = req.headers['x-api-key']
    if(!token)
    return res.status(400).send({ status: false, msg: "Token is required"})
    let decodedToken = jwt.verify(token, "first project")     
    if(!decodedToken)
    return res.send({ status: false, msg: "token is invalid"})
    next()

}catch(err){
    res.status(500).send({Error:err.message})
}
}

const authorize = function(req, res, next){
    try{
    let token = req.headers['x-api-key'];
    if(!token)
    return res.status(401).send({status: false, msg:"Token not present"})
    let decodedToken = jwt.verify(token, "first project",)
    if(!decodedToken)
    return res.status(401).send({status:false,msg:"Token is invalid"})
    let userToBeModified = req.params.authorId
    let userLoggedIn = decodedToken.authorId
    if(userToBeModified !== userLoggedIn)
    return res.status(400).send({status: false, msg:"User is not allowed for logged in"})
    next()
}catch(err){
    res.status(500).send({Error: err.message})
}
}

module.exports.authenticate=authenticate
module.exports.authorize=authorize