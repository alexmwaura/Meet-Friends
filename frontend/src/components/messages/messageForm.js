import React, { Component } from "react";
import { Segment, Button, Input } from "semantic-ui-react";
import firebase from "../../Auth/firebase";
import FileModal from "./fileModal";
import {v4 as uuidv4} from "uuid";
import ProgressBar from "./ProgressBar";
import { Loader, Dimmer } from "semantic-ui-react";


class messageForm extends Component {
  state = {
    storageRef: firebase.storage().ref(),
    uploadState: "",
    uploadTask: null,
    message: "",
    loading: false,
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messagesRef: this.props.messagesRef,
    errors: [],
    modal: false,
    percentUploaded: 0,
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  handleChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  createMessage = (fileUrl = null) => {
    const { user } = this.state;
    const message = {
      timestamp: firebase.database.ServerValue.TIMESTAMP,
      user: {
        id: user.uid,
        name: user.displayName,
        avatar: user.photoURL,
      },
    };
    if (fileUrl !== null) {
      message["image"] = fileUrl;
    } else {
      message["content"] = this.state.message;
    }
    return message;
  };

  uploadFile = (file, metadata) => {
    const pathToUpload = this.state.channel.id;
    const ref = this.props.messagesRef;
    const filePath = `chat/public/${uuidv4()}.jpeg`;

    this.setState(
      {
        uploadState: "uploading",
        uploadTask: this.state.storageRef.child(filePath).put(file, metadata),
      },
      () => {
        this.state.uploadTask.on(
          "state_changed",
          (snap) => {
            const percentUploaded = Math.round(
              (snap.bytesTransferred / snap.totalBytes) * 100
            );
            this.setState({ percentUploaded });
          },
          (err) => {
            console.error(err);
            this.setState({
              errors: this.state.errors.concat(err),
              uploadState: "error",
              uploadTask: null,
            });
          },
          () => {
            this.state.uploadTask.snapshot.ref
              .getDownloadURL()
              .then((downloadUrl) => {
                this.sendFileMessage(downloadUrl, ref, pathToUpload);
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                  errors: this.state.errors.concat(err),
                  uploadState: "error",
                  uploadTask: null,
                });
              });
          }
        );
      }
    );
  };

  sendMessage = () => {
    const { message, channel, messagesRef } = this.state;
    if (message) {
      this.setState({ loading: true });
      messagesRef
        .child(channel.id)
        .push()
        .set(this.createMessage())
        .then(() => {
          this.setState({ loading: false, message: "", errors: [] });
        })
        .catch((error) => {
          console.error(error);
          this.setState({
            loading: false,
            errors: this.state.errors.concat(error),
          });
        });
    } else {
      this.setState({
        errors: this.state.errors.concat({ message: "Add a message" }),
      });
    }
  };

  sendFileMessage = (fileUrl, ref, pathToUpload) => {
    ref
      .child(pathToUpload)
      .push()
      .set(this.createMessage(fileUrl))
      .then(() => {
        this.setState({ uploadState: "done" });
      })
      .catch((err) => {
        console.error(err);
        this.setState({
          errors: this.state.errors.concat(err),
        });
      });
  };

  render() {
    const {
      errors,
      message,
      loading,
      modal,
      uploadState,
      percentUploaded,
      user,
    } = this.state;

    const getLength = (obj)=> {
      if(obj === null) return 0
      const lengthUser = Object.keys(obj).length
      return lengthUser 
    }

    return (
      <Segment className="message__form">
        <Input
          fluid
          name="message"
          style={{ marginBottom: "0.7em" }}
          label={<Button icon={"add"} />}
          value={message}
          labelPosition="left"
          placeholder="Write your message"
          onChange={this.handleChange}
          className={
            errors.some((error) => error.message.includes("message"))
              ? "error"
              : ""
          }
        />
        <ProgressBar
          uploadState={uploadState}
          percentUploaded={percentUploaded}
        />

        {getLength(user) > 0 ?(
          <Button.Group icon widths="2">
          <Button
            color="orange"
            content="Add Reply"
            labelPosition="left"
            icon="edit"
            onClick={this.sendMessage}
            
            disabled={loading}
          />
          <Button
            color="teal"
            content="Upload Media"
            labelPosition="right"
            icon="cloud upload"
            disabled={uploadState === "uploading"}
            onClick={this.openModal}
          />
        </Button.Group>
        ):(
          <Dimmer active>
            <Loader size="small" content="Please Wait loding chat..." />
          </Dimmer>
        )}
        <FileModal
            modal={modal}
            closeModal={this.closeModal}
            uploadFile={this.uploadFile}
          /> 
        
      </Segment>
    );
  }
}

export default messageForm;
