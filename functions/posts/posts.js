const { db, admin } = require("../util/admin");
const config = require("../config/config");
const { validatePostData, postReducers } = require("../validator/validator");

// add post function
exports.postQuote = (req, res) => {
  const postData = {
    author: req.body.author,
    title: req.body.title,
    post: req.body.post,
    date: new Date().toISOString(),
    // permalink: "",
    // tags: {},
  };
  const { valid, errors } = validatePostData(postData);
  if (!valid) return res.status(400).json(errors);
  db.collection("posts")
    .add(postData)
    .then((data) => {
      return res.status(200).json({ success: "Post successfull" });
    })
    .catch((error) => {
      return res.status(500).json({ general: "Something went wrong" });
    });
};

// update post function
exports.updatePost = (req, res) => {
  let postDetails = postReducers(req.body);
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((post) => {
      post.ref.update(postDetails);
      return res.json({ message: "Post updated successfully" });
    }) .catch((error) => {
      console.error(error);
    });  
};


// get all posts function
exports.getPosts = (req, res) => {
  db.collection("posts")
    .orderBy("date", "desc")
    .get()
    .then((posts) => {
      const postData = [];
      posts.forEach((post) => {
        postData.push({
          title: post.data().title,
          post: post.data().post,
          author: post.data().author,
          background: post.data().background,
          date: post.data().date,
          id: post.id,
        });
      });
      return res.status(200).json(postData);
    })
    .catch((error) => {
      console.error(error);
    });
};

// exports.uploadImage = (req,res) => {
//     const BusBoy = require("busboy")
//     const path = require("path")
// }
