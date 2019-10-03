var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    text: String,
    //author: String
    author:{ // author becomes an object with "id" and "username"
        id: {
            type: mongoose.Schema.Types.ObjectId,  // associate the "id" with the "user"
            ref: "User"
        },
        username: String
    }
})

module.exports = mongoose.model("Comment", commentSchema);