var express = require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

router.get("/", function(req, res){
    res.render("landing");
});

// Show register form
router.get("/register", function(req, res){
    res.render("register");
});

// Sign-up logic 
router.post("/register", function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    User.register(new User({username:username}), password, function(err, user){
        if(err){
            req.flash("error", err.message) // err is object with name and message
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to YelpCamp" + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// Show login form
router.get("/login", function(req, res){
    res.render("login", {error: req.flash("error")}); // pass the value of "error" to "message" in the view page: login.ejs
});

// Login logic (a middleware required and it will check the login info)
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
    
});

// Logout route
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "You logged out!");
    res.redirect("/");
});

// Middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;