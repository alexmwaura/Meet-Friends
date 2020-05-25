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
      <Grid container columns="equal" className="app" style={{background:
      
      `${userColors.primaryColor}`}} >
        <ColorPanel
        key={authenticatedUser && authenticatedUser.uid} 
        currentUser={authenticatedUser}
        
        />
        <SidePanel
          authenticatedUser={authenticatedUser}
          userColors={userColors}
        />

     <Grid  columns={2} style={{ marginLeft:'8em'}}>
     <Grid.Column style={{  width: "50em" }}>
          <Messages
            userColors={userColors}
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
              firstLoad={firstLoad}
            />
          </span>
        </Grid.Column>
     </Grid>
      </Grid>
    );
  
}

export default landingPage;