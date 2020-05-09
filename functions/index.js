const functions = require("firebase-functions")
const app = require("express")()
const {postQuote,getPosts,updatePost} = require("./posts/posts")

// post request
app.post("/post", postQuote)
app.post("/post/:postId",updatePost)
//  get request
app.get("/all/posts", getPosts)







exports.api = functions.region("us-central1").https.onRequest(app)
