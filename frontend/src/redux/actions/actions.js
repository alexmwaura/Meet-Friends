import { LOADING_UI, SET_ERRORS, SET_AUTHENTICATED, SET_USER, STOP_LOADING_UI,SET_CURRENT_CHANNEL } from "../store/types"
import firebase from "../../Auth/firebase"
import axios from "axios"
import jwt_decode from "jwt-decode"

export const login = (email, password) => (dispatch, next) => {
  firebase.auth().signInWithEmailAndPassword(email, password).then(data => {
    if (data) {
      const {email} = data.user
      dispatch(getCurrentUser(email))
    }
  })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err
      })
    });
}




export const multiAuth = (provider, scope) => (dispatch) => {
  provider.addScope(`${scope[0]}`);
  if (scope[1]) provider.addScope(`${scope[1]}`)
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      if (result.credential) {
        const { user } = result
        let token;
        const { displayName, email, xa } = user
        token = xa
        const { picture, user_id } = jwt_decode(token)

        const userData = {
          email: email,
          username: displayName,
          profileImage: picture
        }
        dispatch(getCurrentUser(email))
        dispatch(googleSignup(userData, user_id))
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err
      })
    });

}


export const authenticateGoogle = () => (dispatch) => {
  dispatch({ type: LOADING_UI })
  const provider = new firebase.auth.GoogleAuthProvider()
  let scope = ["profile", "email"]
  dispatch(multiAuth(provider, scope))

}



// export const authenticateFaceBook = () => (dispatch) => {
//   dispatch({type: LOADING_UI})
//   const provider = new firebase.auth.FacebookAuthProvider()
//   let scope = ["user_birthday"]
//   dispatch(multiAuth(provider,scope))

// }

export const authenticateGithub = () => (dispatch) => {
  dispatch({ type: LOADING_UI })
  const provider = new firebase.auth.GithubAuthProvider()
  let scope = ["repo"]
  // let email = "email"
  dispatch(multiAuth(provider, scope))
}


export const googleSignup = (userData, userId) => (dispatch) => {
  dispatch({ type: LOADING_UI })
  axios.post(`/google/${userId}`, userData)
    .then(res => {
      if (res.data) {
        return
      }
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err
      })
    });

}

export const loginUser = (userData) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then(() => {
      dispatch(login(userData.email, userData.password))

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
    payload: user
  }
}

export const getCurrentUser = (email) => (dispatch) => {
  dispatch({type: LOADING_UI})
  axios.get(`/user/${email}`).then(user => {
    if(user){
      dispatch({ type: SET_USER, payload: user.data })
    }
  }).then(()=> {
    dispatch({type: STOP_LOADING_UI})
  })
  .catch((err) => {
   console.log(err)
  })
}

export const setCurrentChannel = (channel)=> (dispatch)=>{
  dispatch({
    type: SET_CURRENT_CHANNEL,
    payload:{
      currentChannel: channel
    }
  })
}
