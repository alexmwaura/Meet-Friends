import React, { Component } from 'react'
import landingPage from './components/landingPage/landingPage'
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import login from './pages/login/login'
import {Provider} from "react-redux"
import store from "./redux/store/store"

class App extends Component {
  render() {
    return (
      <div>
       <Provider store={store}>
       <Router>
          <Switch>
            <Route exact path="/login" component={login} />
            <Route exact path="/" component={landingPage} />
          </Switch>
        </Router>
       </Provider>
      </div>
    )
  }
}

export default App
