import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./messageHeader";
import MessageForm from "./messageForm";
import firebase from "../../Auth/firebase";
import Message from "./Message";
import Spinner from "../spinner/spinner";
import {connect} from "react-redux"
import {setUserPosts} from '../../redux/actions/actions'


class Messages extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
    usersRef: firebase.database().ref("users"),
    messagesRef: firebase.database().ref("messages"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    channel: this.props.currentChannel,
    currentUser: this.props.authenticatedUser,
    messages: [],
    loading: true,
    numUniqueUsers: "",
    searchTerm: "",
    searchLoading: false,
    searchResults: [],
    isChannelStarred: false,
  };

  componentDidMount() {
    const { channel, currentUser } = this.state;
    if (channel && currentUser) {
      this.addListeners(channel.id);
      this.addUserStarsListener(channel.id, currentUser.uid);
    }
  }
  
  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };

  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addUserStarsListener = (channelId, userId) => {
    this.state.usersRef
      .child(userId)
      .child("starred")
      .once("value")
      .then((data) => {
        if (data.val() !== null) { 
          const channelIds = Object.keys(data.val());
          const prevStarred = channelIds.includes(channelId);
          // console.log(prevStarred)
          this.setState({ isChannelStarred: prevStarred });
        }
      });
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({ messages: loadedMessages, loading: false });
    });
    this.countUniqueUsers(loadedMessages);
    this.countUserPosts(loadedMessages)
  };

  countUniqueUsers = (messages) => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.id)) {
        acc.push(message.user.id);
      }
      return acc;
    }, []);

    const numUniqueUsers = `${uniqueUsers.length} user${
      uniqueUsers.length > 1 ? "s" : ""
    }`;
    this.setState({ numUniqueUsers: numUniqueUsers });
  };


  countUserPosts = (messages) => {
    let userPosts = messages.reduce((acc,message)=> {
      if(message.user.name in acc){
        acc[message.user.name].count += 1
      }else {
        acc[message.user.name] = {
          avatar: message.user.avatar,
          count: 1
        }
      }
      return acc
    },{})
    this.props.setUserPosts(userPosts)
  }

  displayMessages = (messages) =>
    messages.length > 0 ? (
      messages.map((message) => (
        <Message
          key={message.timestamp}
          message={message}
          user={this.state.currentUser}
        />
      ))
    ) : (
      <Spinner messages={messages} />

      // <Spinner messages={messages} />'
    );

  displayChannelName = (channel) => {
    return channel
      ? `${this.state.privateChannel ? "@" : "#"}${channel.name}`
      : "";
  };

  getUserPhoto = (channel) => {
    return channel && channel.photoURL ? channel.photoURL : "";
  };

  handleSearch = (event) => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => {
        this.handleSearchMessages();
      }
    );
  };
  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, "gi");
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults: searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  handleStar = () => {
    this.setState(prevState => ({
        isChannelStarred: !prevState.isChannelStarred,
      }),
      () => this.starChannel()
    );
  };
  starChannel = () => {
    if (this.state.isChannelStarred) {
      this.state.usersRef
        .child(`${this.state.currentUser.uid}/starred`)
        .update({
          [this.state.channel.id]: {
            name: this.state.channel.name,
            details: this.state.channel.details,
            createdBy: {
              name: this.state.channel.createdBy.name,
              avatar: this.state.channel.createdBy.avatar,
            },
          },
        });
    } else {
      this.state.usersRef
        .child(`${this.state.currentUser.uid}/starred`)
        .child(this.state.channel.id)
        .remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
    }
  };

  render() {
    const {
      messagesRef,
      channel,
      currentUser,
      messages,
      numUniqueUsers,
      searchTerm,
      searchResults,
      searchLoading,
      privateChannel,
      isChannelStarred,
    } = this.state;
    // console.log(channel)
    return (
      <Fragment>
        <MessagesHeader
          handleSearch={this.handleSearch}
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          searchLoading={searchLoading}
          privateChannel={privateChannel}
          userPhoto={this.getUserPhoto(channel)}
          handleStar={this.handleStar}
          isChannelStarred={isChannelStarred}
        />
        <Segment>
          <Comment.Group className="messages">
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>
        <MessageForm
          messagesRef={messagesRef}
          currentChannel={channel}
          privateChannel={privateChannel}
          currentUser={currentUser}
          getMessagesRef={this.getMessagesRef}
        />
      </Fragment>
    );
  }
}

export default connect(null,{setUserPosts})(Messages);
