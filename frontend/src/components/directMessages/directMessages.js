import React, { Component, Fragment } from "react";
import { Menu, Icon, Image } from "semantic-ui-react";
import firebase from "../../Auth/firebase";
import { setCurrentChannel,setPrivateChannel } from "../../redux/actions/actions";
import { connect } from "react-redux";

class directMessages extends Component {
  state = {
    user: this.props.user,
    users: [],
    userRef: firebase.database().ref("users"),
    connectedRef: firebase.database().ref(".info/connected"),
    presenceRef: firebase.database().ref("presence"),
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }
  addListeners = (currentUserUid) => {
    const { userRef, connectedRef, presenceRef } = this.state;
    let loadedUsers = [];
    userRef.on("child_added", (snap) => {
      let user = snap.val();
      // user["uid"] = snap.key;
      user["status"] = "offline";
      if (this.state.user && this.state.user.uid !== user["userId"]) {
        loadedUsers.push(user);
      }

      this.setState({ users: loadedUsers });
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
      photoURL: user.profileImage
    };
    this.props.setCurrentChannel(channelData);
    this.props.setPrivateChannel(true)
  };

  render() {
    const { users } = this.state;
    // console.log(users);

    return (
      <Menu.Menu className="menu">
        <Menu.Item>
          <span>
            <Icon name="mail" />
            DIRECT MESSAGES
          </span>{" "}
          ({users.length})
        </Menu.Item>
        <Menu.Item>
          {users.map((user) => (
            <Menu.Item
              key={user.userId}
              // active={user.uid === activeChannel}
              onClick={() => this.changeChannel(user)}
              style={{ opacity: 0.7, fontStyle: "italic" }}
            >
              <Icon
                name="circle"
                color={this.isUserOnline(user) ? "green" : "red"}
              />
              <span>
                {" "}
                <Image src={user.profileImage} spaced="right" avatar />
              </span>
              {user.username}
            </Menu.Item>
          ))}
        </Menu.Item>
      </Menu.Menu>
    );
  }
}

export default connect(null, { setCurrentChannel,setPrivateChannel })(directMessages);
