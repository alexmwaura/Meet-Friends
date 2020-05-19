import React, { Component,Fragment } from 'react'
import {Segment, Comment} from "semantic-ui-react"
import MessagesHeader from "./messageHeader"
import MessageForm from "./messageForm"
import firebase from "../../Auth/firebase"

 class messages extends Component {

    state = {
        messagesRef: firebase.database().ref('messages'),
        channel: this.props.currentChannel,
        currentUser: this.props.currentUser
    }

    componentDidMount(){
        const {channel,currentUser} = this.state
        if(channel&& currentUser){
            this.addListeners(channel.id)
        }
    }

    addListeners =(channelId) => {
        this.addMessageListener(channelId)
    }

    addMessageListener = (channelId) => {
       let loadedMessages = []
       this.state.messagesRef.child(channelId).on("child_added", snap=> {
           loadedMessages.push(snap.val())
           console.log(loadedMessages)
       }) 
    }


    render() {
        const {messagesRef,channel,currentUser} = this.state
        return (
          <Fragment>
              <MessagesHeader />
              <Segment>
                  <Comment.Group className="messages">

                  </Comment.Group>
              </Segment>
              <MessageForm 
              messagesRef={messagesRef}
              currentChannel={channel}
              currentUser={currentUser}
              />
          </Fragment>  
        )
    }
}

export default messages
