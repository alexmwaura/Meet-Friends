import React from "react";
import { Loader, Dimmer } from "semantic-ui-react";
import {connect} from "react-redux"

const Spinner = (props) => {
 

 const {user: {authenticated},} = props
  return (
    <Dimmer active>
     {authenticated? (
        <Loader size="huge" content="Preparing Chat..." />
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

