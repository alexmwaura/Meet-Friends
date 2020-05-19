import React, { Component } from 'react'
import { Segment, Button, Input } from "semantic-ui-react"
import firebase from "../../Auth/firebase"

class messageForm extends Component {
    state = {
        message: "",
        loading: false,
        channel: this.props.currentChannel,
        user: this.props.currentUser,
        messagesRef: this.props.messagesRef,
        errors: []
    }
    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value })
    }

    createMessage = () => {
        const { user } = this.state
        const message = {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
                id: user.userId,
                name: user.username,
                avatar: user.profileImage
            },
            content: this.state.message
        }
        return message
    }



    sendMessage = () => {
        const { message, channel,messagesRef } = this.state
        if (message) {
            this.setState({ loading: true })
            messagesRef.child(channel.id).push().set(this.createMessage())
                .then(() => {
                    this.setState({ loading: false, message: "", errors: [] })
                }).catch((error) => {
                    console.error(error)
                    this.setState({
                        loading: false,
                        errors: this.state.errors.concat(error)
                    })
                })

        } else {
            this.setState({
                errors: this.state.errors.concat({ message: 'Add a message' })
            })
        }
    }

    render() {
        const { errors,message,loading } = this.state
        return (
            <Segment className="message__form">
                <Input fluid name="message" style={{ marginBottom: '0.7em' }}
                    label={<Button icon={'add'} />}
                    value={message}
                    labelPosition="left"
                    placeholder="Write your message"
                    onChange={this.handleChange}
                    className={
                        errors.some(error => error.message.includes('message')) ? 'error' : ''
                    }

                />
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
                        onClick={this.handleReply}
                    />
                </Button.Group>
            </Segment>
        )
    }
}

export default messageForm
