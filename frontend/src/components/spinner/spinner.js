import React,{Fragment} from "react";
import { Loader, Dimmer } from "semantic-ui-react";
import {connect} from "react-redux"
import Box from "@material-ui/core/Box"
import Typography from "@material-ui/core/Typography"

const Spinner = ({user,messages}) => {
 

 const {authenticated} = user
  return (
   <Fragment>
     {authenticated ? (
    
       
         <Fragment>
            {messages.length > 0 ?
            (<Dimmer active>
              <Loader size="huge" content="Preparing Chat..." />
              </Dimmer>)
            : 
            <Box>
               <Typography className="animated pulse" style={{backgroundColor:"#fff", color:"#000", textAlign:"center",height:"54vh"}}>

                 <h1 style={{fontFamily:"italic", fontSize:"xx-large"}}>
                 Add Message
                 </h1>
               </Typography>
            </Box>
            
            }

         </Fragment>
        
       
     ):(
      <Loader size="huge" content="Please Wait login in..." />
    
     )}
    </Fragment>
  )

}
const mapStateToProps = state => ({
  user: state.user
})

export default connect(mapStateToProps)(Spinner)

