import React, { Component } from 'react'
import {Menu, Sidebar} from "semantic-ui-react"
import UserPanel from "../userPanel/userpanel"
import "../landingPage/index.css"
import Channels from "../channels/Channels"
import DirectMessages from "../directMessages/directMessages"
import Starred from "../starred/starred"
import Box from "@material-ui/core/Box"
import AboutMe from "../AboutMe/about"


class sidePanel extends Component {

    state = {
        displayActiveUsers: "inline",
       
       
    }


    

    handleDisplayActiveUsers =()=> {
        this.setState({displayActiveUsers: "none"})
    }
    closeActiveUsers =()=> {
        this.setState({displayActiveUsers: "inline"})
    }

    

    render() {
        const { isMobile,displayActiveUsers } = this.state;
        return (

         
        
                
            <Menu
            inverted
            // className="sidebar"
            // fluid
            fixed="left"
            vertical
            size="small"
            style={{background: `${this.props.userColors.secondaryColor}`, fontSize: '1.2rem', height: '100vh', overFlow: "scroll", }}
            >
            <UserPanel
            currentUser={this.props.authenticatedUser} 
           
            
            />
            <br />
            <Starred 
            currentUser={this.props.authenticatedUser}
            />

            <DirectMessages 
            handleDisplayActiveUsers={this.handleDisplayActiveUsers}
            user = {this.props.authenticatedUser}
            closeActiveUsers={this.closeActiveUsers}
            />

            <Box display={displayActiveUsers} >
            <Channels authenticatedUser={this.props.authenticatedUser}/>
            <AboutMe 
            
            
            />
            </Box>
            </Menu>
    
         
          
           
           
       
         
        )
    }
}



export default sidePanel
