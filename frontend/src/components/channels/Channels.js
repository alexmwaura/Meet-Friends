import React, { Component, Fragment } from 'react'
import { Menu, Icon, Modal, Form, Input, Button } from "semantic-ui-react"
import firebase from "../../Auth/firebase"
import { Loader, Dimmer } from "semantic-ui-react";
import {setCurrentChannel} from "../../redux/actions/actions"
import {connect} from "react-redux"


class Channels extends Component {

    state = {
        channels: [],
        channelName: "",
        channelDetails: "",
        modal: false,
        channelsRef: firebase.database().ref('channels'),
        firstLoad: true ,
        activeChannel:''

    }

    componentDidMount() {this.addListeners()}
    UNSAFE_componentWillMount(){this.removeListeners()}
    removeListeners = () => {this.state.channelsRef.off() }

    closeModal = () => { this.setState({ modal: false }) }

    openModal = () => { this.setState({ modal: true }) }

    handleChange = (event) => { event.preventDefault();this.setState({ [event.target.name]: event.target.value })}
    

    addListeners = () => {
        let loadedChannels = []
        this.state.channelsRef.on("child_added", snap => {
            loadedChannels.push(snap.val())
            this.setState({ channels: loadedChannels }, ()=> this.setFirstChannel())
        })
    }

    setFirstChannel =() => {
        const firstChannel = this.state.channels[0]
        if(this.state.firstLoad && this.state.channels.length > 0){
            this.setActiveChannel(firstChannel)
            this.props.setCurrentChannel(firstChannel)
        }
        this.setState({firstLoad: false})   
    }
    setActiveChannel = channel => {
        console.log(channel)
        this.setState({activeChannel: channel.id})
    }

    addChannel = () => {
        const { channelsRef, channelName, channelDetails } = this.state
        const { username, email, userId, profileImage } = this.props.authenticatedUser
        const key = channelsRef.push().key
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: username,
                email: email,
                avatar: profileImage,
                userId: userId
            }
        }
        channelsRef.child(key).update(newChannel).then(() => {
            this.setState({ channelName: "", channelDetails: "" })
            this.closeModal()
            console.log("Channel added")
        }).catch((error) => {
            console.error(error)
        })
    }

    displayChannels = (channels) => (
        channels.length > 0 && channels.map(channel => (
            <Menu.Item 
            key={channel.id}
            onClick={() => this.changeChannel(channel)}
            name={channel.name}
            style={{opacity: 0.8,textAlign:'center'}}
            active={channel.id === this.state.activeChannel}
            >
                # {channel.name}
            </Menu.Item>
        ))
    )

    handleSubmit = (event) => {
        if (this.isformValid(this.state)) {
            this.addChannel()
        }
    }

    isformValid = ({ channelName, channelDetails }) => channelName && channelDetails;

    changeChannel = channel => {
        this.setActiveChannel(channel)
        this.props.setCurrentChannel(channel)
    }


    render() {
        const { modal, channels } = this.state
        return (
            <Fragment>
                <Menu.Menu style={{ paddingBottom: "2em" }} className="menu_item2">
                    <Menu.Item style={{textAlign:'center'}}>
                        <span><Icon name="exchange" /> CHANNELS </span> {" "}
               ({channels.length}) <Icon name="add" className="add" onClick={this.openModal} />

                    </Menu.Item>
                    {this.displayChannels(channels)}
                </Menu.Menu>

                <Modal basic open={modal} onClose={this.closeModal}>
                    {this.props.authenticatedUser ? (
                        <Fragment>
                            <Modal.Header>Add a Channel </Modal.Header>
                            <Modal.Content>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Field className="form-control" style={{backGroundColor: '#607d8b'}}>
                                        <Input fluid label="Name of channel" name="channelName" onChange={this.handleChange}


                                        />
                                    </Form.Field>
                                    <Form.Field className="form-control">
                                        <Input fluid label="About the channel" name="channelDetails" onChange={this.handleChange} />
                                    </Form.Field>
                                </Form>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button inverted color="green" onClick={this.handleSubmit}>
                                    <Icon name="checkmark" /> Add
                        </Button>
                                <Button inverted color="red" onClick={this.closeModal}>
                                    <Icon name="remove" /> Cancel
                        </Button>
                            </Modal.Actions>
                        </Fragment>
                    ) : (
                            <Dimmer active>
                                <Loader size="huge" content="Please Wait authenticating..." />
                            </Dimmer>
                        )}

                </Modal>
            </Fragment>

        )
    }
}




export default connect(null,{setCurrentChannel})(Channels)
