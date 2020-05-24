import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import ColorPanel from "../colorPanel/colorPanel";
import SidePanel from "../sidePanel/sidePanel";
import Messages from "../messages/Messages";
import MetaPanel from "../metaPanel/metaPanel";

export class landingPage extends Component {
  render() {
    const {
      currentChannel,
      authenticatedUser,
      isPrivateChannel,
      userPost,
      userColors
    } = this.props;
    // console.log(isPrivateChannel)
    return (
      <Grid container columns="equal" className="app" style={{background: `${userColors.primary}`}}>
        <ColorPanel 
        key={authenticatedUser && authenticatedUser.name}
        user={authenticatedUser}
        
        />
        <SidePanel
          authenticatedUser={authenticatedUser}
          key={authenticatedUser && authenticatedUser.uid}
          userColors={userColors}
        />

     <Grid style={{marginLeft: "14em"}}>
     <Grid.Column style={{  width: "45em" }}>
          <Messages
            key={currentChannel && currentChannel.id}
            currentChannel={currentChannel}
            authenticatedUser={authenticatedUser}
            isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>

        <Grid.Column style={{width: "20em"}}>
          <span>
            <MetaPanel
              key={currentChannel && currentChannel.id}
              isPrivateChannel={isPrivateChannel}
              currentChannel={currentChannel}
              userPost={userPost}
            />
          </span>
        </Grid.Column>
     </Grid>
      </Grid>
    );
  }
}

export default landingPage;