import React, { Fragment } from "react";
import { Comment, Image } from "semantic-ui-react";
import moment from "moment";
import Box from "@material-ui/core/Box";

const isOwnMessage = (message, user) => {
  return message.user.id === user.uid ? "message__self" : "message_others";
};
const isOwnMessageTwo = (message, user) => {
  return message.user.id === user.uid
    ? "message__selfTwo"
    : "message_others_two";
};

const isImage = (message) => {
  return message.hasOwnProperty("image") && !message.hasOwnProperty("conetent");
};

const timeFromNow = (timestamp) => moment(timestamp).fromNow();

const Message = ({ message, user }) => (
  <Comment>
    <Comment.Content className={isOwnMessage(message, user)}>
      {message.user.id === user.uid ? (
        <Fragment />
      ) : (
        <Comment.Avatar src={message.user.avatar} />
      )}
      <Comment.Content>
        <br />
        <Comment.Author as="a">
          {message.user.id === user.userId ? (
            <Comment.Avatar src={message.user.avatar} />
          ) : (
            <Fragment>{message.user.name}</Fragment>
          )}
        </Comment.Author>
        <Comment.Metadata>{timeFromNow(message.timestamp)}</Comment.Metadata>

        {isImage(message) ? (
          <Image src={message.image} className="message__image" />
        ) : (
          <Comment.Text
            style={{
              textAlign: "center",
              width: "fit-content",
              marginTop: "1em",
            }}
          >
            <Box>
              <h1
                className={isOwnMessageTwo(message, user)}
                style={{ fontSize: "medium" }}
              >
                {" "}
                {message.content}
              </h1>
            </Box>
          </Comment.Text>
        )}
        <br />
        <br />
      </Comment.Content>
    </Comment.Content>
  </Comment>
);
export default Message;
