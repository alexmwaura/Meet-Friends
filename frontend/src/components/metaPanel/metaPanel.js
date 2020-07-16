import React, { Component } from "react";
import {
  Segment,
  Accordion,
  Header,
  Icon,
  Image,
  List,
} from "semantic-ui-react";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"

class metaPanel extends Component {
  state = {
    channel: this.props.currentChannel,
    activeIndex: 0,
    privateChannel: this.props.isPrivateChannel,
    firstLoad: this.props.firstLoad
  };

  setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };

  displayTopPosters = (posts) => (
    Object.entries(posts)
      .sort((a,b) =>b[1] -a[1] )
      .map(([key, val], i) => (
        <List.Item key={i} className="animated fadeInUp">
          <Image src={val.avatar} avatar />
          <List.Content>
            <List.Header as="a">{key.toLocaleLowerCase()}</List.Header>
      <List.Description>{val.count} post{val.count > 1 ? "s": ""}</List.Description>
          </List.Content>
        </List.Item>
      ))
      .slice(0,5).reverse()
  )

  displayUserInformation =(channel) => (
   channel && channel.photoURL ? (
    <Segment>
      
    <Header as="h3" attached="top" className="animated fadeInLeft delay-1s">
      About{"...  @"}{channel.name}
      </Header>
      <Accordion>
      <Accordion.Title
          active={this.state.activeIndex === 0}
          index={0}
          onClick={this.setActiveIndex}
        >
          <Icon name="dropdown" />
          <Icon name="user" />
          {channel.name} Profile
        </Accordion.Title>

        <Accordion.Content active={this.state.activeIndex === 0} className="animated fadeInUp">
        <Image src={channel.photoURL} /> 
        </Accordion.Content>
        </Accordion>
    
     </Segment>):""
   
  )   

  render() {
    const { activeIndex, privateChannel, channel } = this.state;
    const { userPost } = this.props;
  
    if (privateChannel || !channel) return (
      <Box display={this.props.firstLoad} >
      {()=> this.displayUserInformation(channel)}
       </Box>   
    );

    return (
      <Segment >
        <Header as="h3" attached="top" className="animated fadeInLeft delay-1s">
    About{"...  #"}{channel.name}
        </Header>

        <Accordion styled attached="true">
          <Accordion.Title
            active={activeIndex === 2}
            index={2}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="info" />
            Channel Details
          </Accordion.Title>

          <Accordion.Content active={activeIndex === 2} className="animated fadeInUp">
            {channel.details}
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.setActiveIndex}
          >

            <Icon name="dropdown" />
            <Icon name="user circle" />
            Top 5
          </Accordion.Title>

          <Accordion.Content active={activeIndex === 1}>
            <List>
              
              
              { userPost && Object.values(userPost).length > 0 ?  this.displayTopPosters(userPost):<CircularProgress size={20} disableShrink />}</List>
          </Accordion.Content>

          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.setActiveIndex}
          >
            <Icon name="dropdown" />
            <Icon name="pencil alternate" />
            Created By
          </Accordion.Title>

          <Accordion.Content active={activeIndex === 0} className="animated fadeInUp delay-0.5s">
            <Image src={channel.createdBy.avatar}  />
            <Typography
            variant="body1"
            style={{ opacity: 0.8, fontStyle: "italic", textAlign: "center" }}
            >
            {channel.createdBy.name.toLowerCase()}
            </Typography>
            
          </Accordion.Content>
        </Accordion>

    
      </Segment>
    );
  }
}

export default metaPanel;
