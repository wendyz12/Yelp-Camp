var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
    // console.log(req.user) whether or not someone signed in, there will be req.user as either defined (loggedin user) or undefined
    
    // Get all the data from the DATABASE !!!
    Campground.find({},function(err, allCampgrounds){
        if(err){
            console.log("SOMETHING WENT WRONG~!");
        }else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds, currentUser:req.user}); // we have access to any variables that we passed through templates even inside partials
            //console.log(allCampgrounds);
        }
    });
   
});

router.post("/", middleware.isLoggedIn, function(req, res){
    //get the data from form and add to campgrounds array
    var name = req.body.name; // "name" in the "req.body.name" is from the name attributes in the new.ejs
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var newCampground = {name: name, price: price, image: image, description:description};
    // create data in the DATABASE !!!
    Campground.create(newCampground,function(err, campground){
        if(err){
            console.log("SOMETHING WENT WRONG!");
        }else{
            //console.log(campground);
            // add id and username to campground
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            // save campground
            campground.save();
            res.redirect("/campgrounds");
        }
    });

});


router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new");
    //console.log(currentUser);
});

router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            if(!foundCampground){
                return res.status(400).send("Item not found")
            }
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})

//EIDT CAMPGROUND ROUTE
router.get("/:id/edit", middleware.checkCampgroundAuthor, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            return res.status(400).send("Item not found")
        }else{
            res.render("campgrounds/edit", {campground: foundCampground});
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/:id", middleware.checkCampgroundAuthor, function(req, res){
    // find and update  the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });

    
});

//DELETE CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundAuthor, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Campground deleted!")
            res.redirect("/campgrounds");
        }
    });
});
// // MIDDLEWARE 1: check if user has logged in
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// // MIDDLEWARE 2: check if user is the one who created the campgrounds, so that they can edit, update or delete the campgrounds. Otherwise they are not authorized to do so. 

// function checkCampgroundAuthor(req, res, next){
//     if(req.isAuthenticated()){
//         // if logged in, check if req.user._id = campground.author.id
//         Campground.findById(req.params.id, function (err, foundCampground){
//             if(err){
//                 res.redirect("/campgrounds")
//             }else{
//                 var checkId = foundCampground.author.id.toString();
//                 if(checkId == req.user._id){
//                     next();
//                 }else{
//                     res.redirect("back")
//                 }
//             }
//         })
//             //if so, run next()
            
//             //else, res.redirect("/campgrounds")
//     }else{
//         res.redirect("back");
//     }
// }

module.exports = router;