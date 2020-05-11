const { db, admin } = require("../util/admin");
const config = require("../config/config");

const { validatePostData, postReducers } = require("../validator/validator");

// add post function
exports.postQuote = (req, res) => {
  const postData = {
    userId: req.user.userId,
    email: req.user.email,
    profileImage: req.user.profileImage,
    author: req.user.username,
    title: req.body.title,
    post: req.body.post,
    date: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  const { valid, errors } = validatePostData(postData);

  if (!valid) return res.status(400).json(errors);
  db.collection("posts")
    .add(postData)
    .then((data) => {
      let id = data.id;
      data.update({ postId: id });
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
      // console.error(error);
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
          ...post.data(),
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

// comment on single Post
exports.commentOnPost = (req, res) => {
  if (req.body.comment.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    comment: req.body.comment,
    createdAt: new Date().toISOString(),
    postId: req.params.postId,
    username: req.user.username,
    email: req.user.email,
    userId: req.user.userId,
    profileImage: req.user.profileImage,
  };

  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(400).json({ error: "Post not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db
        .collection("comments")
        .add(newComment)
        .then((comment) => {
          comment.update({ commentId: comment.id });
        });
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

// like single post
exports.likePost = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("email", "==", req.user.email)
    .where("postId", "==", req.params.postId)
    .limit(1);
  const postDocument = db.doc(`/posts/${req.params.postId}`);
  let postData = {};
  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        if (doc.data().email === req.user.email)
          return res.json({ error: "Can not like own post" });
        return likeDocument
          .get()
          .then((data) => {
            if (data.empty) {
              return db
                .collection("likes")
                .add({
                  postId: req.params.postId,
                  email: req.user.email,
                  username: req.user.username,
                  userId: req.user.userId,
                })
                .then((like) => {
                  like.update({ likeId: like.id });
                })
                .then(() => {
                  postData.likeCount++;
                  return postDocument.update({ likeCount: postData.likeCount });
                })
                .then(() => {
                  return res.json(postData);
                });
            }
            return res.status(400).json({ error: "Post already liked" });
          })
          .catch((err) => {
            console.error(err);
            res.status(500).json({ error: err.code });
          });
      }
      return res.status(404).json({ error: "Post not found" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// unlike post
exports.unlikePost = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("email", "==", req.user.email)
    .where("postId", "==", req.params.postId)
    .limit(1);
  const postDocument = db.doc(`/posts/${req.params.postId}`);
  let postData = {};
  postDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        postData = doc.data();
        postData.postId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Post not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Post not liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            postData.likeCount--;
            return postDocument.update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// delete comment
exports.deleteComment = (req, res) => {
  const postDocument = db.doc(`/posts/${req.params.postId}`);
  db.doc(`/comments/${req.params.commentId}`)
    .delete()
    .then(() => {
      postDocument.get().then((post) => {
        let postData = post.data();
        postData.commentCount--;
        postDocument.update({ commentCount: postData.commentCount });
      });
      return res.json({ success: "Successfully deleted" });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// delete post
exports.deletePost = (req, res) => {
  const document = db.doc(`/posts/${req.params.postId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Post not found" });
      }
      if (doc.data().email !== req.user.email) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Post deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
