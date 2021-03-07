const { check } = require('express-validator');
var express = require("express");
var router = express.Router();

const { signout, signup, signin, isSignedIn } = require("../controllers/auth")

router.post("/signup", [
    check("name", "name should be atleast of 3 characters").isLength({ min: 3 }),
    check("email", "Email must be valid").isEmail(),
    check("password", "password should be atleast of 3 characters").isLength({ min: 3 })
], 
signup
);

router.post("/signin", [
    check("email", "Email must be valid").isEmail(),
    check("password", "password should be atleast of 3 characters").isLength({ min: 3 })
], 
signin
);

router.get("/signout", signout);



module.exports = router;