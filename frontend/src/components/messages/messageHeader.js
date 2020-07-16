import React, { Component } from "react";
import { Header, Segment, Input, Icon,Image } from "semantic-ui-react";
import { CircularProgress } from "@material-ui/core";

class messageHeader extends Component {
  render() {
    const {
      channelName,
      numUniqueUsers,
      handleSearch,
      searchLoading,
      privateChannel,
      userPhoto,
      handleStar,
      isChannelStarred
    } = this.props;

    return (
      <Segment clearing>
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            {userPhoto ?  <Image src={userPhoto} spaced="right" style={{height: '2em'}} avatar />:""}
            {(channelName).toLowerCase()}
           {!privateChannel && ( 
           <Icon 
           name={isChannelStarred? "star": "star outline"} 
           color={isChannelStarred? "yellow": "black"}
            onClick={handleStar}

            />) }
          </span>
          <Header.Subheader>
            {!privateChannel && numUniqueUsers }
          </Header.Subheader>
        </Header>
        <Header floated="right">
          <Input
            loading={searchLoading}
            onChange={handleSearch}
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default messageHeader;
