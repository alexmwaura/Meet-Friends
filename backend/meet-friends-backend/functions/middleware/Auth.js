const { admin, db } = require('../util/admin')

module.exports = (request, response, next) => {
    let idToken;
    if (request.headers.authorization && request.headers.authorization.startsWith('Bearer ')) {
        idToken = request.headers.authorization.split('Bearer ')[1];
    } else {
        console.error('No token found');
        return response.status(403).json({ error: 'Unauthorized' });
    }
    admin.auth().verifyIdToken(idToken)
        .then((decodedToken) => {
            request.user = decodedToken;
            return db.collection('users').where('userId', '==', request.user.uid).limit(1).get();
        })
        .then((data) => {
            request.user.username = data.docs[0].data().username;
            request.user.profileImage = data.docs[0].data().profileImage;
            request.user.coverImage = data.docs[0].data().coverImage;
            request.user.email = data.docs[0].data().email;
            request.user.userId = data.docs[0].data().userId
            return next();
        })
        .catch((error) => {
            console.error('Verification error on token', error);
            return response.status(403).json(error);
        });
};