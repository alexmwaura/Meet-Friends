import React from 'react'
import LandingPage from './components/landingPage/landingPage'
import './App.css';
import {Grid }from "semantic-ui-react"
import { connect } from "react-redux"

const App =({user,currentChannel})=> {
    return (
      <Grid container>
        <Grid.Column>
       <LandingPage
       user={user}
       currentChannel={currentChannel}
       />
          </Grid.Column> 
      </Grid>

    )
  
}

const mapStateToProps = (state) => ({
  UI: state.UI,
  user: state.user.currentUser,
  currentChannel: state.channel.currentChannel
})

export default connect(mapStateToProps)(App)
