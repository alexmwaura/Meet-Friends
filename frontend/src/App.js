import React from 'react'
import LandingPage from './components/landingPage/landingPage'
import './App.css';
import {Grid }from "semantic-ui-react"
import { connect } from "react-redux"

const App =({currentChannel,authenticatedUser,isPrivateChannel,userPost})=> {
    return (
      <Grid container>
        <Grid.Column>
       <LandingPage
       authenticatedUser={authenticatedUser}
       currentChannel={currentChannel}
       isPrivateChannel={isPrivateChannel}
       userPost={userPost}
       />
          </Grid.Column> 
      </Grid>

    )
  
}

const mapStateToProps = (state) => ({
  UI: state.UI,
  authenticatedUser: state.user.authenticatedUser,
  currentChannel: state.channel.currentChannel,
  isPrivateChannel: state.channel.isPrivateChannel,
  userPost: state.channel.userPost
})

export default connect(mapStateToProps)(App)
