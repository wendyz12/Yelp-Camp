// All middlewares
// Option 1
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middlewareObj = {};

middlewareObj.checkCampgroundAuthor = function(req, res, next){
    if(req.isAuthenticated()){
        // if logged in, check if req.user._id = campground.author.id
        Campground.findById(req.params.id, function (err, foundCampground){
            if(err){
                res.redirect("/campgrounds")
            }else{
               if(!foundCampground){
                   req.flash("error", "Campground not found");
                   return res.redirect("back");
               } 
                var checkId = foundCampground.author.id.toString();
                if(checkId == req.user._id){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that!");
                    res.redirect("back")
                }
            }
        })
            //if so, run next()
            
            //else, res.redirect("/campgrounds")
    }else{
        res.redirect("back");
    }
}

middlewareObj.checkCommentAuthor = function(req, res, next){
    if(req.isAuthenticated()){
        //if logged in, check if the user is the author of the comment
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(!foundComment){
                    req.flash("error", "Comment not found")
                    return res.redirect("back");
                }
                var tempId = foundComment.author.id.toString();
                if(tempId == req.user._id){
                    return next();
                }else{
                    res.redirect("back");
                }
            }
        });
    }else{
        res.redirect("back");
    }
};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Login First!"); // According to the position, rather than seeing anything right away, it will add the line to the next request, which is that "login" route will first be executed and then the line will show up
    res.redirect("/login");
};

//Option 2
// var middlewareObj = {
//     checkCampgroundAuthor: function(...){
//         ...
//     }
// }


module.exports = middlewareObj;

//Option 3
// module.exports = {
//     checkCampgroundAuthor: function(...){
//         ...
//     }
// }