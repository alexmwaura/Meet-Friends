import React, { Component, Fragment } from "react";
import { Menu, Icon, Image, Label } from "semantic-ui-react";
import firebase from "../../Auth/firebase";
import {
  setCurrentChannel,
  setPrivateChannel,
} from "../../redux/actions/actions";
import { connect } from "react-redux";

class directMessages extends Component {
  
  state = {
    activeChannel: "",
    user: this.props.user,
    users: [],
    userMessage: null,
    userRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
    privateMessagesRef: firebase.database().ref("privateMessages"),
    notifications: [],
    firstLoad: true,
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
    // console.log(this.state.connectedRef)
  }
  addListeners = (currentUserUid) => {
    const { userRef, connectedRef, presenceRef } = this.state;
    let loadedUsers = [];
    userRef.on("child_added", (snap) => {
      let user = snap.val();
      user["uid"] = snap.key;
      user["status"] = "offline";
      if (this.state.user && this.state.user.uid !== user["userId"]) {
        loadedUsers.push(user);
      }

      this.setState({ users: loadedUsers }, () => this.setFirstUser());
      this.addNotificationListener(snap.key);
    });
    // console.log(loadedUsers)
    connectedRef.on("value", (snap) => {
      if (snap.val() === true) {
        const ref = presenceRef.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove((err) => {
          if (err !== null) {
            console.error(err);
          }
        });
      }
    });

    presenceRef.on("child_added", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    presenceRef.on("child_removed", (snap) => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key, false);
      }
    });
  };

  setFirstUser = () => {
    const firstUser = this.state.users[0];
    if (this.state.firstLoad && this.state.users.length > 0) {
      this.setActiveChannel(firstUser);
      this.setState({ userMessage: firstUser });
    }
    this.setState({ firstLoad: false });
  };

  setActiveChannel = (user) => {
    this.setState({ activeChannel: user.uid });
  };

  addNotificationListener = (userId) => {
    // this.state.privateMessagesRef
    this.state.privateMessagesRef.child(userId).child(this.state.user.uid).on("value", (snap) => {
      if (this.state.userMessage) {
        this.handleNotifications(
          userId,
          this.state.userMessage.uid,
          this.state.notifications,
          snap
        );
      }
    });
  };

  handleNotifications = (userId, currentUserId,notifications, snap) => {
    let lastTotal = 0;
    let index = notifications.findIndex(notification => notification.id === userId)
    if (index !== -1) {
      if (userId !== currentUserId) {
        lastTotal = notifications[index].total;
        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: userId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }
    this.setState({ notifications });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user["status"] = `${connected ? "online" : "offline"}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  getChannelId = (userId) => {
    const currentUserUid = this.state.user.uid;
    return userId < currentUserUid
      ? `${userId}/${currentUserUid}`
      : `${currentUserUid}/${userId}`;
  };

  isUserOnline = (user) => user.status === "online";

  changeChannel = (user) => {
    const channelId = this.getChannelId(user.userId);
    const channelData = {
      id: channelId,
      name: user.username,
      photoURL: user.profileImage,
    };
    
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true);
    this.setActiveChannel(user);
    this.setState({ userMessage: user });
    this.clearNotifications();
  };

  getNotificationCount = (user) => {
    let count = 0;
    this.state.notifications.forEach((notification) => {
      if (notification.id === user.userId) {
        count = notification.count;
      }
    });
    if (count > 0) return count;
  };

  clearNotifications = () => {

    let index = this.state.notifications.findIndex(
      (notification) => notification.id === this.state.userMessage.uid
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  render() {
    const { users, activeChannel } = this.state;

    return (
      <Menu.Menu className="menu_item_direct">
        <Menu.Item>
          <span>
            <Icon name="mail" />
            DIRECT MESSAGES
          </span>{" "}
          ({users.length})
        </Menu.Item>

        {users.map((user) => (
          <Menu.Item
            key={user.userId}
            active={user.userId === activeChannel}
            onClick={() => this.changeChannel(user)}
            style={{ opacity: 0.8, fontStyle: "italic", textAlign: "left" }}
          >
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? "green" : "red"}
            />
            <span>
              {" "}
              <Image src={user.profileImage} spaced="right" avatar />
            </span>
            {this.getNotificationCount(user) && (
              <Label color="red">{this.getNotificationCount(user)}</Label>
            )}
            {user.username.toLowerCase()}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel, setPrivateChannel })(
  directMessages
);
