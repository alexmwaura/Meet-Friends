const admin = require("firebase-admin")
const serviceAccount = require("../config/config.json")
admin.initializeApp({ 
    credential: admin.credential.cert(serviceAccount), 
    storageBucket: "portfolio-alex-eb3ef.appspot.com",
    databaseURL: "https://portfolio-alex-eb3ef.firebaseio.com"
    
})
   
const db = admin.firestore()
module.exports = { admin, db }