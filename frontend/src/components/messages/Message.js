import React,{Fragment} from "react"
import { Comment,Image } from "semantic-ui-react"
import moment from "moment"

const isOwnMessage = (message, user) => {
    return message.user.id === user.uid ? "message__self" : ''
}
const isOwnMessageTwo = (message, user) => {
    return message.user.id === user.uid ? "message__selfTwo" : ''
}

const isImage = (message)=> {
    return message.hasOwnProperty('image') && !message.hasOwnProperty('conetent')
     
}

const timeFromNow = (timestamp) => moment(timestamp).fromNow()

const Message = ({ message, user }) => (
    <Comment >
         {message.user.id === user.uid ? (<Fragment/>)
         :( <Comment.Avatar src={message.user.avatar} />)
         }
        <Comment.Content className={isOwnMessage(message, user)} >
           
        <Comment.Author as="a" >

            {message.user.id === user.userId ? ( <Comment.Avatar  src={message.user.avatar}  />):(<Fragment>{message.user.name}</Fragment>)}
        </Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>
       
        {isImage(message) ? <Image src={message.image} className="message__image"/>: 
         <Comment.Text>{message.content}</Comment.Text>
        }
        <br/>
        <br/>
        </Comment.Content>
    </Comment>
)
export default Message