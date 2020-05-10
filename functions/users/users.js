const { db, admin } = require("../util/admin");
const config = require("../config/config");
const firebase = require("firebase");
firebase.initializeApp(config);

const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.addScope('https://www.googleapis.com/auth/contacts.readonly');
googleProvider.setCustomParameters({
    'login_hint': 'http://localhost:5001/portfolio-alex-eb3ef/us-central1/api/google'
  });
  
// bio: req.body.bio,
// location: req.body.location,
// city: req.body.city,
// address: req.body.address,

const { validateLoginData, validateSignupData } = require("../validator/validator")

exports.signUp = (req, res) => {

    let token, userId
    const defaultProfileImage = "profile.png"
    const defaultCoverImage = "download.png"
    const userData = { 
        email: req.body.email,  
        username: req.body.username,
        password: req.body.password,    
        confirmPassword: req.body.confirmPassword,
    }
    const { valid, errors } = validateSignupData(userData)
    const {email} = userData
    if (!valid) return res.status(400).json(errors)

    db.doc(`/users/${email}`).get()
    .then(user => {
    if (user.exists) return res.json({ email: `Account  ${email} already exists` })
    return firebase.auth().createUserWithEmailAndPassword(userData.email, userData.password)
    })
    .then((data) => { userId = data.user.uid; return data.user.getIdToken() })
    .then((idToken) => {
        token = idToken;
        const newUserData = {
            email: userData.email,
            username: userData.username,
            profileImage: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultProfileImage}?alt=media`,
            coverImage:`https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultCoverImage}?alt=media`,
            userId
        }
        return db.doc(`/users/${userData.email}`).set(newUserData)
    })
    .then(() => { return res.status(201).json({token})})
    .catch((err) => { 
        console.error(err);
        if (err.code === 'auth/email-already-in-use')return res.status(400).json({ email: 'Email is already in use' });
		if (err.code === 'auth/weak-password')return res.status(400).json({ password: 'Password is too short' });
		return res.status(500).json({ general: "Something went wrong please try again" });
	});

}

exports.login = (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password,
    };

    const { valid, errors } = validateLoginData(user);
    if (!valid) return res.status(400).json(errors);

    firebase.auth().signInWithEmailAndPassword(user.email, user.password).then((data) => { return data.user.getIdToken()})
    .then((token) => {return res.json({ token })})
    .catch((error) => { 
        console.error(error)
        return res.status(403).json({ general: 'Wrong credentials please try again' });
        });
};
