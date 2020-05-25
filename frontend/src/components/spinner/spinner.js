import React,{Fragment} from "react";
import { Loader, Dimmer,Segment, Header } from "semantic-ui-react";
import {connect} from "react-redux"
import Box from "@material-ui/core/Box"

const Spinner = ({user,messages}) => {
 

 const {authenticated} = user
  return (
   <Segment>
     {authenticated ? (
    
       
         <Fragment>
            {messages.length > 0 ?
            (<Dimmer active>
              <Loader size="huge" content="Preparing Chat..." />
              </Dimmer>)
            : 
            <Box  className="animated pulse">
               <Header as="h1" style={{backgroundColor:"#fff", color:"#000", textAlign:"center",height:"54vh",fontFamily:"italic", fontSize:"xx-large"}}>

                 Add Message
              
               </Header>
            </Box>
            
            }

         </Fragment>
        
       
     ):(
      <Loader size="huge" content="Please Wait login in..." />
    
     )}
    </Segment>
  )

}
const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(Spinner)

