import React, {Component} from 'react';
import "semantic-ui-css/semantic.min.css";

import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import Login from './pages/login/login'
import Signup from './pages/signup/signup'

import {Provider,connect} from "react-redux"
import store from "./redux/store/store"
import firebase from "./Auth/firebase"
import * as serviceWorker from './serviceWorker';
import {  SET_UNAUTHENTICATED, STOP_LOADING_UI } from './redux/store/types';
import axios from "axios"
import jwt_decode from "jwt-decode"
import {setAuthenticatedUser} from './redux/actions/actions'

axios.defaults.baseURL = 'https://europe-west1-portfolio-alex-eb3ef.cloudfunctions.net/api'

class Root extends Component {

  setToken(token,email,user){
    if(token){
      axios.defaults.headers.common["Authorization"] = token
      this.props.setAuthenticatedUser(user)
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged(user=> {
      if(user){
        const {xa,email} = user
        const token = `Bearer ${xa}`
        this.setToken(token,email,user)
        store.dispatch({type:STOP_LOADING_UI})
        this.props.history.push("/")
        
        
       if(jwt_decode(xa)['exp'] * 1000 < Date.now()){ 
         store.dispatch({type: SET_UNAUTHENTICATED})
         this.props.history.push("/login") 
        }
      }
      else{
        this.props.history.push('/login') 

      }
            
      
    })

  }  

  render(){
    return(
         <Switch>
            <Route exact path="/" component={App} />
            <Route  path="/login" component={Login} />
            <Route  path="/signup" component={Signup} />
          
         </Switch>
      
      
    )
  }
}
const mapStateFromProps = state => ({
  loading: state.UI.loading,
  channel: state.channel
});


const RootWithAuth = withRouter(connect(mapStateFromProps, {setAuthenticatedUser})(Root))


ReactDOM.render(
  <Provider store={store}>
 <Router>
   <RootWithAuth/>
 </Router>
 </Provider>,

  document.getElementById('root')
);
serviceWorker.register()

