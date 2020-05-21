import React, { Component, Fragment } from 'react'
import { Grid, Header, Icon, Dropdown,Image } from "semantic-ui-react"
import firebase from "../../Auth/firebase"
import store from "../../redux/store/store"
import {SET_UNAUTHENTICATED} from "../../redux/store/types"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress";



class userpanel extends Component {
    state = {
        user: this.props.currentUser
    }
    
    dropDownOptions = () => [
        { key:"user",text: <span >Signed as <strong>
            
    {this.state.user ?(<Fragment>{this.state.user.displayName.toLowerCase()}</Fragment>):(<Fragment/>)}
            
            </strong></span>,disabled: true},
        {key: "avatar",text: <span>Change Avatar</span> },
        { key: "signout",text: <span><Button onClick={this.handleSignout } type="submit" variant="contained" className="button">SignOut</Button></span>}
    ]
    handleSignout =()=> {
        firebase.auth().signOut().then(()=> {
            store.dispatch({type: SET_UNAUTHENTICATED
            })
            
        })
    }
    
    render() {
    
        const {user}= this.state
        // console.log(user)
        
        return (
            <Grid >
                <Grid.Column>
                    <Grid.Row style={{ padding: '1.2em', margin: 0 }} className="menu_item">
                        <Header inverted floated="left" as="h2"  className="animated slideInLeft delay-1s">
                            <Icon name="meetup" />
                            <Header.Content style={{ fontSize: 20 }} >Meet-Friends</Header.Content>
                        </Header>
                    </Grid.Row>
                    <Header style={{ padding: '0.25em' }} as="h4" inverted>
                        <Dropdown 
                        className="dropdown"
                        trigger={

                               <Fragment>
                                {user ? (
                                <span>
                                <Image src={user.photoURL} spaced="right" avatar />

                                {user.displayName}
                                </span> 
                                ):(
                                    <CircularProgress size={20} disableShrink />
                                )}
                               </Fragment>
                           
                        }
                            options={this.dropDownOptions()}
                        />
                    </Header>
                </Grid.Column>
            </Grid>
        )
    }
}

// const mapStateToProps =(state) => ({
//     user: state.user
// })

export default  userpanel
