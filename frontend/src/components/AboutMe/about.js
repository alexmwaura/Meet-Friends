import React from 'react'
import {Segment,Accordion,Button,Header,Menu, Icon} from "semantic-ui-react"
import Box from "@material-ui/core/Box";


class About extends React.Component{
state ={
    display: "none",
    closeMessage: "inline",
    activeIndex: 0,
}
 handleDisplay = () => {
    this.setState({ display: "inline", closeMessage: "none" })
  };

  handleCloseDisplay = () => {
    this.setState({ display: "none", closeMessage: "inline" })
  };

   setActiveIndex = (event, titleProps) => {
    const { index } = titleProps;
    const { activeIndex } = this.state;
    const newIndex = activeIndex === index ? -1 : index;
    this.setState({ activeIndex: newIndex });
  };
   
  render (){
    return (
       
            <Segment style={{bottom:"2em", cursor:"pointer"}}>
       <Box display={this.state.closeMessage}>
       <Header as="h3" attached="top" className="animated fadeInLeft delay-1s" onClick={this.handleDisplay}>
         
          About <br/>
            {"..@"}Developer
         
          </Header>
       </Box>

          <Box display={this.state.display}>
          <Accordion>
          <Accordion.Title
              active={this.state.activeIndex === 0}
              index={0}
              onClick={this.setActiveIndex}
            >
              <Icon name="dropdown" />
              <Icon name="user"  />
              <a href="http://portfolio-alex-eb3ef.firebaseapp.com/">Portfoilio</a>
            </Accordion.Title>
    
            <Accordion.Title 
            active={this.state.activeIndex === 0} 
            index={0}
            className="animated fadeInUp"
            >
             <Icon name="dropdown" />  
            <Icon name="github" />
            <a href="https://github.com/alexmwaura/">Github</a>
            </Accordion.Title>
         
            <Button   onClick={this.handleCloseDisplay} color="youtube">
            <Icon name="close" size="small"/>   close
          </Button>
          
            </Accordion>
          </Box>
        
         </Segment>
           
    )
  }     
  
}

export default About
