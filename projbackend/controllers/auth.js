const User = require("../models/user");
const { validationResult } = require('express-validator');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

exports.signup = (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        });
    }

   const user = new User(req.body);
   user.save((err, savedUser) => {
       if(err){
           return res.status(400).json({
               err : "not able to save user in db"
           });
       }
       res.json({
           name : user.name,
           email : user.email,
           id : user._id  
       });
   });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error : errors.array()[0].msg
        });
    }

    User.findOne({email}, (err, user) => {
        if(err){
           return res.status(400).json({
                error: err.array()[0].msg
            });
        }
        if(!user){
            return res.status(400).json({
                error: "User Email does not exist"
            });
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email or password does not match"
            });
        }
        // creating the token here
        const token = jwt.sign({_id: user._id}, process.env.SECRET);
        // put the token in the cookie
        res.cookie("token", token, {expire: new Date() + 9999});

        // send response to the frontend
        const { name, email, _id, role } = user;
        res.json({token, user : {_id, name, email, role}});
    });
}

exports.signout = (req, res) => {
    res.clearCookie("token")
    return res.json({
        message : "user signout successfully"
    });
};

//protected routes
exports.isSignedIn = expressJwt({
    secret : process.env.SECRET,
    userProperty : "auth"
});

//custom middlewares
exports.isAuthenticated = (req, res, next) => {
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS_DENIED"
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not Admin ACCESS_DENIED"
        });
    }
    next();
}