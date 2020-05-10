const functions = require("firebase-functions")
const app = require("express")()
const {postQuote,getPosts,updatePost,postImage,commentOnPost,deletePost,likePost,unlikePost} = require("./posts/posts")
const {signUp,login} = require("./users/users")
const AuthMiddleware = require("./middleware/Auth")

// authentication routes
app.post("/signup",signUp)
app.post("/login",login)

// posts routes
app.post("/post", AuthMiddleware,postQuote)
app.post("/post/:postId", AuthMiddleware,updatePost)
app.post("/post/image/:postId", AuthMiddleware,postImage)
app.post("/comment/:postId",AuthMiddleware,commentOnPost)
app.post("/like/:postId",AuthMiddleware,likePost)
app.post("/unlike/:postId",AuthMiddleware,unlikePost)
app.delete("/post/delete/:postId",AuthMiddleware,deletePost)
app.get("/all/posts", getPosts)




exports.api = functions.region("us-central1").https.onRequest(app)
