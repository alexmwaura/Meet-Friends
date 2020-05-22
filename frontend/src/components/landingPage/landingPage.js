import React, { Component } from 'react'
import {Grid} from "semantic-ui-react"
import ColorPanel from "../colorPanel/colorPanel"
import SidePanel from "../sidePanel/sidePanel"
import Messages from "../messages/Messages"
import MetaPanel from "../metaPanel/metaPanel"



export class landingPage extends Component {
   
    render() {
        const {currentChannel,authenticatedUser,isPrivateChannel} = this.props
        // console.log(isPrivateChannel)
        return (
            <Grid container columns="equal" className="app" >
                <ColorPanel/>
                      <SidePanel 
                      authenticatedUser={authenticatedUser}
                      key={authenticatedUser && authenticatedUser.uid}
                      />
                  
            <Grid.Column style={{ marginLeft: "15em", width: '30em'}}>
            <Messages
            key={currentChannel && currentChannel.id} 
            currentChannel={currentChannel}
            authenticatedUser={authenticatedUser}
            isPrivateChannel={isPrivateChannel}
            
            />
            </Grid.Column>

            <Grid.Column style={{ width: 4}}>
            <MetaPanel />
            </Grid.Column>
              
            </Grid>
        )
    }
}



export default landingPage
