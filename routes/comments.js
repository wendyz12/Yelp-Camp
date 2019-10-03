var express = require("express");
// var router = express.Router({mergeParams: true}); 
var router  = express.Router({mergeParams: true});// make req.params.id in campground.js avaiable to comments.js as well
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware") // obmit "/index" because of the its name "index.js", automatically, the program will call index.js when it requires the directory "middleware"

router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{campground:foundCampground});
        }
    });
});

// ADD new comment
router.post("/", middleware.isLoggedIn, function(req, res){
    var newComment = req.body.comment;
    Comment.create(newComment, function(err, comment){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Campground.findById(req.params.id, function(err, foundCampground){
                if(err){
                    console.log(err);
                }else{
                    if(!foundCampground){
                        return res.status(400).send("Item not found")
                    }
                    
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment? it is important to save the data as long as it has association with other data ! 
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect('/campgrounds/'+ foundCampground._id);
                }
            });
            
        }
    });
    
});

//EDIT Comment Route
router.get("/:comment_id/edit", middleware.checkCommentAuthor, function(req, res){
   Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
          res.redirect("back");
      } else {
        res.render("comments/edit", {id: req.params.id, comment: foundComment});
      }
   });
});

//UPDATE Comment Route
router.put("/:comment_id", middleware.checkCommentAuthor, function(req, res){
    //find comment
    //pass the value from edit.ejs to the route (more like add a new comment)
    //make new comment
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DELETE Comment Route
router.delete("/:comment_id", middleware.checkCommentAuthor, function (req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comment Deleted!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// // MIDDLEWARE 1: whether logged in or not
// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// // MIDDLEWARE 2: whether the comment belongs to the user
// function checkCommentAuthor(req, res, next){
//     if(req.isAuthenticated()){
//         //if logged in, check if the user is the author of the comment
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 res.redirect("back");
//             }else{
//                 var tempId = foundComment.author.id.toString();
//                 if(tempId == req.user._id){
//                     return next();
//                 }else{
//                     res.redirect("back");
//                 }
//             }
//         })
//     }else{
//         res.redirect("back");
//     }
// }

module.exports = router;