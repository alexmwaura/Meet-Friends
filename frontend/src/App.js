import React from 'react'
import LandingPage from './components/landingPage/landingPage'
import './App.css';
import {Grid }from "semantic-ui-react"
import { connect } from "react-redux"
import Responsive from "react-responsive-decorator"


const App =({currentChannel,authenticatedUser,isPrivateChannel,userPost,colors,firstLoad})=> {
    return (
      <Grid container>
        <Grid.Column>
       <LandingPage
       key={authenticatedUser && authenticatedUser.uid}
       authenticatedUser={authenticatedUser}
       currentChannel={currentChannel}
       isPrivateChannel={isPrivateChannel}
       userPost={userPost}
       userColors={colors}
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
  userPost: state.channel.userPost,
  colors: state.colors,
  firstLoad: state.UI.firstLoad
  
})

export default Responsive(connect(mapStateToProps)(App))
