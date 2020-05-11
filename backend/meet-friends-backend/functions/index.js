const functions = require("firebase-functions")
const app = require("express")()
const {postQuote,getPosts,updatePost,postImage,commentOnPost,deletePost,likePost,unlikePost,deleteComment} = require("./posts/posts")
const {signUp,login,getNotification,googleSignup} = require("./users/users")
const AuthMiddleware = require("./middleware/Auth")
const {db} = require("./util/admin")

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
app.post("/comment/delete/:postId/:commentId",AuthMiddleware,deleteComment)
app.get("/all/posts", getPosts)
app.get("/google", googleSignup)



exports.api = functions.region("us-central1").https.onRequest(app)


// create notification on comment
exports.createNotificationOnComment = functions.region('us-central1').firestore.document('comments/{id}').onCreate((snap)=> {
	const {postId} = snap.data()
	return	db.doc(`/posts/${postId}`).get().then(post=>{
		if(post.exists && post.data.userId !== snap.data().userId ){
			return db.doc(`/notifications/${snap.id}`).set({
				createdAt: new Date().toISOString(),
                recipientEmail: post.data().email,
                senderEmail: snap.data().email,
                type: 'comment',
                read: false,
                postId: post.id
			})

		}
	})

})

// create notification on like
exports.createNotifactionOnlike = functions.region('us-central1').firestore.document('likes/{id}').onCreate((snap)=> {
	const {postId} = snap.data()
	return	db.doc(`/posts/${postId}`).get().then(post=>{
		if(post.exists && post.data.userId !== snap.data().userId ){
			return db.doc(`/notifications/${snap.id}`).set({
				createdAt: new Date().toISOString(),
                recipientEmail: post.data().email,
                senderEmail: snap.data().email,
                type: 'like',
                read: false,
                postId: post.id
			}).then(data=> {
				console.log(data)
			})

		}
	})

})

// delete notification on unlike
exports.deleteNotificationOnUnlike = functions.region('us-central1').firestore.document('likes/{id}').onDelete((snapshot) => {
		return db.doc(`/notifications/${snapshot.id}`).delete().then(() => {}).catch((error) => {console.error(error);	});
});    

// delete notification on comment delete
exports.deleteNotificationOnComment = functions.region('us-central1').firestore.document('comments/{id}').onDelete((snapshot) => {
		return db.doc(`/notifications/${snapshot.id}`).delete().then(() => {}).catch((error) => {console.error(error);	});
});  	

// detect changes on post image
exports.onPostImageChange = functions.region('us-central1').firestore.document('/posts/{postId}').onUpdate((change) => {

    if (change.before.data().postImageUrl !== change.after.data().postImageUrl) {
    	console.log('Image has changed')    
    	const batch = db.batch();
    	return db
    		.collection('posts')
    		.where('author', '==', change.before.data().username)
    		.get()
    		.then((data) => {
    			data.forEach((doc) => {
    				const scream = db.doc(`/posts/${doc.id}`);
    				batch.update(scream, { userImage: change.after.data().postImageUrl });
    			});
    		return batch.commit();
        });
        
    }else return true;
});

// detect changes on cover image
exports.onCoverImageChange = functions.region('us-central1').firestore.document('/users/{userId}').onUpdate((change) => {

    if (change.before.data().coverImage !== change.after.data().coverImage) {
    	console.log('Image has changed')    
    	const batch = db.batch();
    	return db
    		.collection('users')
    		.where('email', '==', change.before.data().email)
    		.get()
    		.then((data) => {
    			data.forEach((doc) => {
    				const user = db.doc(`/users/${doc.id}`);
    				batch.update(user, { userImage: change.after.data().coverImage });
    			});
    		return batch.commit();
    	});
    }else return true;
});

// detect changes on profile image change
exports.onProfileImageChange = functions.region('us-central1').firestore.document('/users/{userId}').onUpdate((change) => {

    if (change.before.data().profileImage !== change.after.data().profileImage) {
    	console.log('Image has changed')    
    	const batch = db.batch();
    	return db
    		.collection('users')
    		.where('email', '==', change.before.data().email)
    		.get()
    		.then((data) => {
    			data.forEach((doc) => {
    				const user = db.doc(`/users/${doc.id}`);
    				batch.update(user, { userImage: change.after.data().profileImage });
    			});
    		return batch.commit();
    	});
    }else return true;
});
   
// detect changes on post delete
exports.onPostDelete = functions.region('us-central1').firestore.document('/posts/{postId}').onDelete((snapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch()
    return db.collection('comments').where('postId', '==', postId).get()
    .then(data => {
        data.forEach(doc => {
            batch.delete(db.doc(`/comments/${doc.id}`))
        })
        return db.collection('likes').where('postId', '==', postId).get()
    })
    .then(data => {
        data.forEach(doc => {
            batch.delete(db.doc(`/likes/${doc.id}`))
        })
        return db.collection('notifications').where('postId', '==', postId).get()
    })
    .then(data => {
        data.forEach(doc => {
            batch.delete(db.doc(`/notifications/${doc.id}`))
        })
        return batch.commit()
        
    })
    .catch(err => {console.error(err)})
        
})    
    