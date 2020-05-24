import React, { Component } from 'react'
import {SliderPicker} from "react-color"
import {Sidebar,Menu,Divider,Button,Modal,Icon,Label,Segment} from "semantic-ui-react"

 class colorPanel extends Component {
    state ={
        modal: false,
        primary: '',
        secondary: ''
       
    }

   
    openModal = ()=> this.setState({modal: true})
    closeModal = ()=> this.setState({modal: false})

    handleChangePrimary = (color) => this.setState({primary: color.hex})
    handleChangeSecondary = (color) => this.setState({secondary: color.hex})


    

    render() {
        const {modal,primary,secondary} = this.state
        return (
            <Sidebar
             as={Menu}  inverted vertical visible width="very thin"
             >
                 <Divider/>
                 <Button icon="add" size="small" color="blue" 
                 onClick={this.openModal}
                 />

            <Modal basic open={modal}>
            <Modal.Header>Choose App Colors</Modal.Header>
            <Modal.Content>
            <Segment inverted>
            <Label content="Primary Color" />
            <SliderPicker 
            onChange={this.handleChangePrimary}
             color={primary}   
            // color={ this.state.sliderColor }
            />
            </Segment>


           <Segment inverted>
           <Label content="Secondary Color" />
            <SliderPicker
            color={secondary} 
            onChange={this.handleChangeSecondary}
            />
           </Segment>
            </Modal.Content>
            <Modal.Actions>
                <Button color="green" inverted>
                    <Icon name="checkmark" /> Save Colors
                </Button>
                <Button color="red" inverted onClick={this.closeModal}>
                    <Icon name="remove" /> Cancel
                </Button>
            </Modal.Actions>
            </Modal>
            </Sidebar>
        )
    }
}

export default colorPanel
