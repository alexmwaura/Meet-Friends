import React, { Component } from 'react'
import {Menu} from "semantic-ui-react"
import UserPanel from "../userPanel/userpanel"
import "../landingPage/index.css"
import Channels from "../channels/Channels"
import DirectMessages from "../directMessages/directMessages"

 class sidePanel extends Component {

    render() {
        return (

           
        
            <Menu  fixed="left" inverted vertical style={{background: '#607d8b', fontSize: '1.2rem'}} >
                
            <UserPanel currentUser={this.props.authenticatedUser} />
            <br/>
            <Channels authenticatedUser={this.props.authenticatedUser}/>
            <DirectMessages 
            key={this.props.authenticatedUser && this.props.authenticatedUser.uid}
            user={this.props.authenticatedUser}/>
           
         </Menu>
         
        )
    }
}



export default sidePanel
