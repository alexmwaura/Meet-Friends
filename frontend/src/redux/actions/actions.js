import {
  LOADING_UI,
  SET_ERRORS,
  SET_AUTHENTICATED,
  SET_PRIVATE_CHANNEL,
  SET_CURRENT_CHANNEL,
  SET_USER_POST,
} from "../store/types";
import firebase from "../../Auth/firebase";
import axios from "axios";
import jwt_decode from "jwt-decode";
import config from "../../config/config";

export const login = (email, password) => (dispatch, next) => {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((data) => {
      if (data) {
        const { email } = data.user;
        dispatch(registerUser(data))
        
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err,
      });
    });
};


export const multiAuth = (provider, scope) => (dispatch) => {
  provider.addScope(`${scope[0]}`);
  if (scope[1]) provider.addScope(`${scope[1]}`);
  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      if (result.credential) {
        const { user } = result;
        let token;
        const { displayName, email, xa } = user;
        token = xa;
        const { picture, user_id } = jwt_decode(token);

        const userData = {
          email: email,
          username: displayName,
          profileImage: picture,
        };
        dispatch(googleSignup(userData, user_id));
        dispatch(registerUser(result))
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err,
      });
    });
};

export const authenticateGoogle = () => (dispatch) => {
  dispatch({ type: LOADING_UI });
  const provider = new firebase.auth.GoogleAuthProvider();
  let scope = ["profile", "email"];
  dispatch(multiAuth(provider, scope));
};

export const registerUser = (createdUser) => {
  const defaultProfileImage = "profile.png";
  const defaultCoverImage = "download.png";
  const userId = firebase.auth().currentUser.uid;
  // console.log(userId)
  const regUser = firebase.database().ref("users");
  const userRef = firebase
    .database()
    .ref("/users/" + userId)
    .once("value")
    .then((snapshot) => {
      // console.log(snapshot.val())
      if (snapshot.val() !== null) {

        return {
          type: SET_ERRORS,
          payload: { email: `${snapshot.val().email} exists` },
        };
      } else {
        // console.log(createdUser)
        return regUser.child(createdUser.user.uid).set({
          email: createdUser.user.email,
          username: createdUser.user.displayName,
          profileImage: createdUser.user.photoURL,
          coverImage: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${defaultCoverImage}?alt=media`,
          userId: userId
        });
      }
    });
};

// export const authenticateFaceBook = () => (dispatch) => {
//   dispatch({type: LOADING_UI})
//   const provider = new firebase.auth.FacebookAuthProvider()
//   let scope = ["user_birthday"]
//   dispatch(multiAuth(provider,scope))

// }

export const authenticateGithub = () => (dispatch) => {
  dispatch({ type: LOADING_UI });
  const provider = new firebase.auth.GithubAuthProvider();
  let scope = ["repo"];
  // let email = "email"
  dispatch(multiAuth(provider, scope));
};

export const googleSignup = (userData, userId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post(`/google/${userId}`, userData)
    .then((res) => {
      if (res.data) {
        return;
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err,
      });
    });
};

export const loginUser = (userData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(() => {
      dispatch(login(userData.email, userData.password));
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const signupUser = (newUserData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then(() => {
      dispatch(login(newUserData.email, newUserData.password));
      
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const setAuthenticatedUser = (user) => {
  return {
    type: SET_AUTHENTICATED,
    payload: user,
  };
};



export const setCurrentChannel = (channel) => (dispatch) => {
  dispatch({
    type: SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel,
    },
  });
};

export const setPrivateChannel = isPrivateChannel => {
  return {
      type: SET_PRIVATE_CHANNEL,
      payload: {
          isPrivateChannel
      }
  }
}

export const setUserPosts = message => {
  return {
    type:SET_USER_POST,
    payload: message
  }
}