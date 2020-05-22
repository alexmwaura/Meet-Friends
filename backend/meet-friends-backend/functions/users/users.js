const { db, admin } = require("../util/admin");
const config = require("../config/config");
const firebase = require("firebase");
firebase.initializeApp(config);

// bio: req.body.bio,
// location: req.body.location,
// city: req.body.city,
// address: req.body.address,

const {
  validateLoginData,
  validateSignupData,
} = require("../validator/validator");

exports.signUp = (req, res) => {
  // let token, userId
  const defaultProfileImage = "profile.png";
  const userData = {
    email: req.body.email,
    username: req.body.username,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
  };
  const { valid, errors } = validateSignupData(userData);
  const { email } = userData;
  if (!valid) return res.status(400).json(errors);

  db.doc(`/users/${email}`)
    .get()
    .then((user) => {
      if (user.exists)
        return res.json({ email: `Account  ${email} already exists` });
      return firebase
        .auth()
        .createUserWithEmailAndPassword(userData.email, userData.password)
        .then((createdUser) => {
           return createdUser.user
            .updateProfile({
              displayName: userData.username,
              photoURL: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultProfileImage}?alt=media`,
            })
        }).then(()=> {
            return res.json({success: `Account ${email} created successfully`})
        })
        .catch((error) => {
          console.error(error);
          return res
            .status(500)
            .json({ general: "Something went wrong please try again" });
        });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        return res.status(400).json({ email: "Email is already in use" });
      if (err.code === "auth/weak-password")
        return res.status(400).json({ password: "Password is too short" });
      return res
        .status(500)
        .json({ general: "Something went wrong please try again" });
    });
};

exports.googleSignup = (req, res) => {
  const defaultProfileImage = "profile.png";
  const defaultCoverImage = "download.png";
  const userData = {
    email: req.body.email,
    username: req.body.username,
    profileImage: req.body.profileImage,
    coverImage: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultCoverImage}?alt=media`,
    userId: req.params.userId,
  };
  const { email } = userData;

  db.doc(`/users/${email}`)
    .get()
    .then((user) => {
      if (user.exists) {
        console.log("success log");
        return res.json({ success: "Loged in successfully" });
      } else {
        return db
          .doc(`/users/${email}`)
          .set(userData)
          .then(() => {
            console.log({ success: "Signup successfull" });
            return res.json({ success: "Signup successfull" });
          })
          .catch((error) => {
            console.error(error);
            return res.status(403).json({ general: "Something went wrong" });
          });
      }
    })
    .catch((error) => {
      console.error(error);
      return res.status(403).json({ general: "Something went wrong" });
    });
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return res.status(400).json(errors);

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((error) => {
      console.error(error);
      return res
        .status(403)
        .json({ general: "Wrong credentials please try again" });
    });
};

exports.getCurrentUser = (req, res) => {
  db.doc(`/users/${req.user.email}`)
    .get()
    .then((user) => {
      return res.status(200).json(user.data());
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: "Something went wrong" });
    });
};

exports.getUserDetails = (req, res) => {
  db.collection("notifications")
    .where("recipient", "==", req.user.email)
    .orderBy("createdAt", "desc")
    .get()
    .then((notifications) => {
      const notificationList = [];
      notifications.forEach((notification) => {
        notificationList.push(notification.data());
      });
      return res.json(notificationList);
    })
    .catch((error) => {
      console.error(error);
      return res.status(403).json({ general: "Something went wrong" });
    });
};

exports.getNotification = (req, res) => {
  db.collection("notifications")
    .get()
    .then((data) => {
      console.log(data.docs[0]);
      const dataList = [];
      data.forEach((not) => {
        dataList.push(not.data());
      });
      return res.json(dataList);
    })
    .catch((error) => {
      console.error(error);
      return res.status(403).json({ general: "Something went wrong" });
    });
};
