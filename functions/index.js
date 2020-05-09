const functions = require("firebase-functions")
const app = require("express")()
const {postQuote,getPosts,updatePost,postImage} = require("./posts/posts")

// post request
app.post("/post", postQuote)
app.post("/post/:postId",updatePost)
app.post("/post/image/:postId", postImage)
//  get request
app.get("/all/posts", getPosts)







exports.api = functions.region("us-central1").https.onRequest(app)
