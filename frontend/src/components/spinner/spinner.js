import React,{Fragment} from "react";
import { Loader, Dimmer } from "semantic-ui-react";
import {connect} from "react-redux"

const Spinner = ({user,messages}) => {
 

 const {authenticated} = user
  return (
    <Dimmer active>
     {authenticated? (

        <Fragment>
          {messages.length > 0 ? <Loader size="huge" content="Preparing Chat..." />:<h1 className="animated pulse">Add message</h1>}
        </Fragment>
     ):(
      <Loader size="huge" content="Please Wait login in..." />
     )}
    </Dimmer>
  )

}
const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(Spinner)

