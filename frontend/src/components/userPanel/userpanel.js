import React, { Component, Fragment } from "react";
import {
  Grid,
  Header,
  Icon,
  Dropdown,
  Image,
  Modal,
  Input,
  Button,
} from "semantic-ui-react";
import firebase from "../../Auth/firebase";
import store from "../../redux/store/store";
import { SET_UNAUTHENTICATED } from "../../redux/store/types";
import AvatarEditor from "react-avatar-editor";
import CircularProgress from "@material-ui/core/CircularProgress";

class userpanel extends Component {
  state = {
    user: this.props.currentUser,
    modal: false,
    userRef: firebase.auth().currentUser,
    storageRef: firebase.storage().ref(),
    usersRef: firebase.database().ref("users"),
    croppedImage: "",
    previewImage: "",
    blob: null,
    uploadedCroppedImage: "",
    metadata: {
      contentType: "image/jpeg",
    },
  };

  openModal = () => this.setState({ modal: true });
  closeModal = () => this.setState({ modal: false });

  dropDownOptions = () => [
    {
      key: "user",
      text: (
        <span className="animated fadeInDown delay-1s">
          Signed as{" "}
          <strong>
            {this.state.user ? (
              <Fragment>{this.state.user.displayName.toLowerCase()}</Fragment>
            ) : (
              <Fragment />
            )}
          </strong>
        </span>
      ),
      disabled: true,
    },
    {
      key: "avatar",
      text: (
        <span
          className="animated fadeInDown delay-0.5s"
          onClick={this.openModal}
        >
          Change Avatar
        </span>
      ),
    },
    {
      key: "signout",
      text: (
        <span className="animated fadeInDown delay-0.5s">
          <Button
            onClick={this.handleSignout}
            type="submit"
            color="teal"
            //

            // iconPosition="right"
          >
            <Icon name="blind" />
            <span>
              {/* <Icon name="question circle outline" />  */}
              SignOut
            </span>
          </Button>
        </span>
      ),
    },
  ];

  uploadCroppedImage = () => {
    const { storageRef, userRef, blob, metadata } = this.state;

    storageRef
      .child(`avatars/user-${userRef.uid}`)
      .put(blob, metadata)
      .then((snap) => {
        snap.ref.getDownloadURL().then((downloadURL) => {
          this.setState({ uploadedCroppedImage: downloadURL }, () =>
            this.changeAvatar()
          );
        });
      });
  };

  changeAvatar = () => {
    this.state.userRef
      .updateProfile({
        photoURL: this.state.uploadedCroppedImage,
      })
      .then(() => {
        console.log("PhotoURL updated");
        this.closeModal();
      })
      .catch((err) => {
        console.error(err);
      });

    this.state.usersRef
      .child(this.state.user.uid)
      .update({ profileImage: this.state.uploadedCroppedImage })
      .then(() => {
        this.changeMessageAvatar();
        console.log("User avatar updated");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  handleChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener("load", () => {
        this.setState({ previewImage: reader.result });
      });
    }
  };

  handleCropImage = () => {
    if (this.avatarEditor) {
      this.avatarEditor.getImageScaledToCanvas().toBlob((blob) => {
        let imageUrl = URL.createObjectURL(blob);
        this.setState({
          croppedImage: imageUrl,
          blob,
        });
      });
    }
  };

  handleSignout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        store.dispatch({ type: SET_UNAUTHENTICATED });
      });
  };

  render() {
    const { user, modal, previewImage, croppedImage } = this.state;
    // console.log(user)

    return (
      <Grid>
        <Grid.Column>
          <Grid.Row
            style={{ padding: "1.2em", margin: 0 }}
            className="menu_item"
          >
            <Header
              inverted
              floated="left"
              as="h2"
              className="animated fadeInDown delay-1s"
            >
              <Icon name="meetup" />
              <Header.Content style={{ fontSize: 20 }}>
                Meet-Friends
              </Header.Content>
            </Header>
          </Grid.Row>
          <Header style={{ padding: "0.25em" }} as="h4" inverted>
            <Dropdown
              className="dropdown"
              trigger={
                <Fragment>
                  {user ? (
                    <span>
                      <Image src={user.photoURL} spaced="right" avatar />

                      {user.displayName}
                    </span>
                  ) : (
                    <CircularProgress size={20} disableShrink />
                  )}
                </Fragment>
              }
              options={this.dropDownOptions()}
            />
          </Header>

          <Modal open={modal} onClose={this.closeModal}>
            <Modal.Header>Change Avatar</Modal.Header>
            <Modal.Content>
              <Input
                onChange={this.handleChange}
                fluid
                icon="user"
                // iconPosition="right"
                type="file"
                label="New Avatar"
                name="previewImage"
              />
              <Grid centered stackable columns={2}>
                <Grid.Row centered>
                  <Grid.Column className="ui center aligned grid">
                    {previewImage && (
                      <AvatarEditor
                        ref={(node) => (this.avatarEditor = node)}
                        image={previewImage}
                        width={130}
                        height={130}
                        border={60}
                        scale={1}
                      />
                    )}
                  </Grid.Column>
                  <Grid.Column>
                    {croppedImage && (
                      <Image
                        style={{ margin: "3.5em auto" }}
                        width={100}
                        height={100}
                        src={croppedImage}
                      />
                    )}
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
            <Modal.Actions>
              {croppedImage && (
                <Button
                  color="green"
                  inverted
                  onClick={this.uploadCroppedImage}
                >
                  <Icon name="save" /> Change Avatar
                </Button>
              )}
              <Button color="green" inverted onClick={this.handleCropImage}>
                <Icon name="image" /> Preview
              </Button>
              <Button color="red" inverted onClick={this.closeModal}>
                <Icon name="remove" /> Cancel
              </Button>
            </Modal.Actions>
          </Modal>
        </Grid.Column>
      </Grid>
    );
  }
}

// const mapStateToProps =(state) => ({
//     user: state.user
// })

export default userpanel;
