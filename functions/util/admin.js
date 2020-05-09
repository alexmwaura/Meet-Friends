const admin = require("firebase-admin")
const serviceAccount = require("../config/multi-use.json")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: "portfolio-alex-eb3ef.appspot.com"
    
})
const db = admin.firestore()

module.exports = {admin, db}