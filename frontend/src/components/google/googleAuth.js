import React, { Component } from 'react'
import * as firebase from "firebase"
// import * as admin from "firebase-admin"
import Config from "../../config/config"
import IconButton from "@material-ui/core/IconButton"
import axios from "axios"
// import serviceAccount from "../../config/config.json"

firebase.initializeApp(Config)
var provider = new firebase.auth.GoogleAuthProvider()
provider.addScope('profile');
provider.addScope('email');





class googleAuth extends Component {

    constructor(){
        super()
        this.state = {
            username: "",
            email: "",
            userId:"",
            errors: {}
        }
    }

    handleLogin(){
        firebase.auth().signInWithPopup(provider).then((result) =>{
            if (result.credential) {
            var token = result.credential.accessToken;
            var user = result.user;
            const  {displayName, email,uid} = user
            console.log(displayName, email,uid)
            this.setState({username: displayName, email: email,userId: uid})
            }     
          })
          .then(()=> {
            const userData={
                email: this.state.email,
                username: this.state.username
                }
            axios.post(`/google/${this.state.userId}`,userData).then(google=> {
               console.log(google)
           })
          })
          .catch(err=> {
              console.log(err)
          })
    }


    render() {
        return (
            <button onClick={()=> this.handleLogin()}>
               Google 
            </button>
        )
    }
}

export default googleAuth
