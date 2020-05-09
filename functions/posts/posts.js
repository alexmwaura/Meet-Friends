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
      return res.status(200).json({ message: "Post updated successfully" });
    })
    .catch((error) => {
      console.error(error);
      return res.status(500).json({ general: "Something went wrong" });
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
      return res.status(500).json({ general: "Something went wrong" });
    });
};

// add post image
exports.postImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let postImageFile;
  let postImageToBeUploaded = {};

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    postImageFile = `${Math.round(
      Math.random() * 1000000000000
    )}.${imageExtension}`;

    const filePath = path.join(os.tmpdir(), postImageFile);
    postImageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(postImageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: postImageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const postImageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${postImageFile}?alt=media`;
        return db.doc(`/posts/${req.params.postId}`).update({ postImageUrl });
      })
      .then(() => {
        return res.status(200).json({ message: "Image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ general: "Something went wrong" });
      });
  });
  busboy.end(req.rawBody);
};
