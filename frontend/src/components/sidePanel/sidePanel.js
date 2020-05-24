import React, { Component } from 'react'
import {Menu,Button} from "semantic-ui-react"
import UserPanel from "../userPanel/userpanel"
import "../landingPage/index.css"
import Channels from "../channels/Channels"
import DirectMessages from "../directMessages/directMessages"
import Starred from "../starred/starred"
import Box from "@material-ui/core/Box"

 class sidePanel extends Component {

    state = {
        displayActiveUsers: "inline"
    }

    handleDisplayActiveUsers =()=> {
        this.setState({displayActiveUsers: "none"})
    }
    closeActiveUsers =()=> {
        this.setState({displayActiveUsers: "inline"})
    }

    render() {
        return (

           
        
            <Menu  fixed="left" size="large" inverted vertical style={{background: `${this.props.userColors.secondary}`, fontSize: '1.2rem'}} >
                
            <UserPanel currentUser={this.props.authenticatedUser} />
            <br />
            <Starred 
            currentUser={this.props.authenticatedUser}
            />
            <Box display={this.state.displayActiveUsers} >
            <Channels authenticatedUser={this.props.authenticatedUser}/>
            </Box>
    
           <DirectMessages 
            key={this.props.authenticatedUser && this.props.authenticatedUser.uid}
            user={this.props.authenticatedUser}
            handleDisplayActiveUsers={this.handleDisplayActiveUsers}
            closeActiveUsers={this.closeActiveUsers}

            />
           
           
         </Menu>
         
        )
    }
}



export default sidePanel
