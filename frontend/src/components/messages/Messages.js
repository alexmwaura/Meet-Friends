import React, { Component, Fragment } from "react";
import { Segment, Comment } from "semantic-ui-react";
import MessagesHeader from "./messageHeader";
import MessageForm from "./messageForm";
import firebase from "../../Auth/firebase";
import Message from "./Message";
import Spinner from "../spinner/spinner";

class Messages extends Component {
  state = {
    privateChannel: this.props.isPrivateChannel,
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
  };

  componentDidMount() {
    const { channel, currentUser } = this.state;
    if (channel && currentUser) {
      this.addListeners(channel.id);
    }
  }





  getMessagesRef = () => {
   const {messagesRef, privateMessagesRef,privateChannel} = this.state
   return privateChannel ? privateMessagesRef:messagesRef
  }


  addListeners = (channelId) => {
    this.addMessageListener(channelId);
  };

  addMessageListener = (channelId) => {
    let loadedMessages = [];
    const ref = this.getMessagesRef()
    ref.child(channelId).on("child_added", (snap) => {
      loadedMessages.push(snap.val());
      this.setState({ messages: loadedMessages, loading: false });
    });
    this.countUniqueUsers(loadedMessages);
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

  getUserPhoto = (channel)=> {
    return channel && channel.photoURL ? channel.photoURL: ''
  }

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

export default Messages;
