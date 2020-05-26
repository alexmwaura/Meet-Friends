import React, { Component, Fragment } from "react";
import { Menu, Icon, Modal, Form, Input, Button, Label } from "semantic-ui-react";
import firebase from "../../Auth/firebase";
import { Loader, Dimmer } from "semantic-ui-react";
import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../redux/actions/actions";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import Box from "@material-ui/core/Box"

class Channels extends Component {
  state = {
    channel: null,
    channels: [],
    channelName: "",
    channelDetails: "",
    user: this.props.authenticatedUser,
    modal: false,
    channelsRef: firebase.database().ref("channels"),
    firstLoad: true,
    activeChannel: "",
    loading: false,
    messagesRef: firebase.database().ref("messages"),
    notifications: [],
    typingRef: firebase.database().ref('typing')
  };

  componentDidMount() {
    this.addListeners();
  }

  UNSAFE_componentWillMount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.channelsRef.off();
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({ [event.target.name]: event.target.value });
  };

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelsRef.on("child_added", (snap) => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
      this.addNotificationListener(snap.key);
    });
  };

  addNotificationListener = (channelId) => {
    this.state.messagesRef.child(channelId).on("value", (snap) => {
      // console.log(snap.val())
      if (this.state.channel) {
        this.handleNotifications( 
          channelId,
          this.state.channel.id,
          this.state.notifications,
          snap
        );
      }
    });
  };
   
  
  changeChannel = (channel) => {
    this.state.typingRef.child(channel.id).child(this.state.user.uid).remove()
    this.setActiveChannel(channel);
    this.clearNotifications()
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel });
    
     
  };

  handleNotifications = (channelId, currentChannelId, notifications, snap) => {

    let lastTotal = 0;
    let index = notifications.findIndex((notification) => notification.id === channelId);

    if (index !== -1) {
      if (channelId !== currentChannelId) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren()

    } else {
      notifications.push({
        id: channelId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }
    this.setState({notifications})
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstLoad && this.state.channels.length > 0) {
      this.setActiveChannel(firstChannel);
      this.props.setCurrentChannel(firstChannel);
      this.setState({channel: firstChannel})
    }
    this.setState({ firstLoad: false });
  };
  setActiveChannel = (channel) => {
    this.setState({ activeChannel: channel.id });
  };

  addChannel = () => {
    const { channelsRef, channelName, channelDetails } = this.state;
    const {
      displayName,
      email,
      uid,
      photoURL,
    } = this.state.user;
    const key = channelsRef.push().key;
    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: displayName,
        email: email,
        avatar: photoURL,
        userId: uid,
      },
    };
    this.setState({loading: true}, ()=> (
      channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: "", channelDetails: "",loading: false });
        this.closeModal();
        console.log("Channel added");
      })
      .catch((error) => {
        console.error(error);
      })
    ))
  };

  getNotificationCount = (channel) => {
    let count = 0
    this.state.notifications.forEach(notification=> {
        if(notification.id === channel.id){
            count = notification.count
        }
    })
    if(count > 0) return count  
  }

  displayChannels = (channels) =>
    channels.length > 0 &&
    channels.map((channel) => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opacity: 0.8, textAlign: "left" }}
        active={channel.id === this.state.activeChannel}
      >
          {this.getNotificationCount(channel) && (<Label color="red">{this.getNotificationCount(channel)}</Label>)}
        # {channel.name}
      </Menu.Item>
    ));

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.isformValid(this.state)) {
      this.addChannel();
    }
  };

  isformValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;


  clearNotifications = () => {
      let index = this.state.notifications.findIndex(notification=> notification.id === this.state.channel.id)

      if (index !== -1){
          let updatedNotifications = [...this.state.notifications]
          updatedNotifications[index].total = this.state.notifications[index].lastKnownTotal
          updatedNotifications[index].count = 0
          this.setState({notifications: updatedNotifications})
      }
  }

  render() {
    const { modal, channels,loading } = this.state;
    return (
      <Fragment>
        <Menu.Menu className="animated fadeInDown menu_item2" >
          <Menu.Item style={{ textAlign: "left" }}>
            <span>
              <Icon name="exchange" /> CHANNELS{" "}
            </span>{" "}
            ({channels.length}){" "}
            <Icon name="add" className="add" onClick={this.openModal} />
          </Menu.Item>
          <Box style={{height:'18vh',overflow:"auto"}}>
          {this.displayChannels(channels)}
          </Box>
        </Menu.Menu>

        <Modal basic open={modal} onClose={this.closeModal}>
          {this.props.authenticatedUser ? (
            <Fragment>
              <Modal.Header>Add a Channel </Modal.Header>
              <Modal.Content>
                <Form onSubmit={this.handleSubmit}>
                  <Form.Field
                    className="form-control"
                    style={{ backGroundColor: "#607d8b" }}
                  >
                    <Input
                    type="text"
                    icon="tags icon"
                    className="ui right labeled left icon input"
                      fluid
                      placeholder="Name of channel"
                      name="channelName"
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                  <Form.Field className="form-control">
                    <Input
                     type="text"
                     icon="tags icon"
                     className="ui right labeled left icon input"
                      fluid
                      placeholder="About the channel"
                      name="channelDetails"
                      onChange={this.handleChange}
                    />
                  </Form.Field>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                {loading ? 
                 <CircularProgress   size={50} disableShrink />
                :
              <Fragment>
                  <Button inverted color="green" onClick={this.handleSubmit}>
                  <Icon name="checkmark" /> Add
                </Button>
                <Button inverted color="red" onClick={this.closeModal}>
                  <Icon name="remove" /> Cancel
                </Button>
              </Fragment>
                
                }
              </Modal.Actions>
            </Fragment>
          ) : (
            <Dimmer active>
              <Loader size="huge" content="Please Wait authenticating..." />
            </Dimmer>
          )}
        </Modal>
      </Fragment>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  Channels
);
