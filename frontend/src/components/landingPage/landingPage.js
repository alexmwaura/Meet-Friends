import React from "react";
import { Grid } from "semantic-ui-react";
import ColorPanel from "../colorPanel/colorPanel";
import SidePanel from "../sidePanel/sidePanel";
import Messages from "../messages/Messages";
import MetaPanel from "../metaPanel/metaPanel";

const landingPage = (
  {
    currentChannel,
    authenticatedUser,
    isPrivateChannel,
    userPost,
    userColors,
    firstLoad
  } 
) => { 

    return (
      <Grid container className="app" style={{background:
      
      `${userColors.primaryColor}`}} >
        <ColorPanel
        key={authenticatedUser && authenticatedUser.uid} 
        currentUser={authenticatedUser}
        
        />
        <SidePanel
          authenticatedUser={authenticatedUser}
          userColors={userColors}
        />

     <Grid  style={{ marginLeft:'8em'}}>
     <Grid.Column mobile={16} largeScreen={12} widescreen={12}>
          <Messages
            userColors={userColors}
            key={currentChannel && currentChannel.id}
            currentChannel={currentChannel}
            authenticatedUser={authenticatedUser}
            isPrivateChannel={isPrivateChannel}
          />
        </Grid.Column>

        <Grid.Column mobile={16} largeScreen={4} widescreen={4}>
          <span>
            <MetaPanel
              key={currentChannel && currentChannel.id}
              isPrivateChannel={isPrivateChannel}
              currentChannel={currentChannel}
              userPost={userPost}
              firstLoad={firstLoad}
            />
          </span>
        </Grid.Column>
     </Grid>
      </Grid>
    );
  
}

export default landingPage;