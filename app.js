var express = require("express");
var app = express();
var request = require("request");
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var flash = require("connect-flash"); // pass the package "connect-flash" to a variable, "flash"
var passport = require("passport");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

mongoose.connect('mongodb://localhost:27017/yelp_camp');//it looks like that it no longer needs this" , { useNewUrlParser: true }"
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public")); //"__dirname" means the directory app.js is under and this will be safer just in case the script is accidently put into an unexpected directory
app.use(methodOverride("_method"));
app.use(flash()); // execute the variable, "flash"
// seedDB();

// =============
// PASSPORT CONFIGURATION
// =============
app.use(require("express-session")({
    secret: "Yelp Camp lol",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up a middleware, whatever function any route calls, they will run this middleware first to define "currentUser" in all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error"); // pass the value of error to all the routes
    res.locals.success = req.flash("success"); 
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP);