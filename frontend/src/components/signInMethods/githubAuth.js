import React, { Component } from 'react'
import { authenticateGithub } from "../../redux/actions/actions"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import Button from "@material-ui/core/Button";
import GitHubIcon from '@material-ui/icons/GitHub';





class githubAuth extends Component {
    UNSAFE_componentWillReceiveProps(nxtProps) {
        if (nxtProps.UI.errors) {
            this.setState({ errors: nxtProps.UI.errors })
        }
    }

    handleLogin = (event) => {
        event.preventDefault()
        this.props.authenticateGithub(this.props.history)
    }


    render() {
        return (

                <Button
                    variant="contained"
                    color="secondary"
                    onClick={this.handleLogin}>
                    <GitHubIcon /><span>GitHub</span>

                </Button>

            

        )
    }
}

// export default githubAuth

githubAuth.propTypes = {
    authenticateGithub: PropTypes.func.isRequired,

}


const mapStateToProps = (state) => ({
    user: state.user,
    UI: state.UI
})

const mapActionsToProps = {
    authenticateGithub
}

export default connect(mapStateToProps, mapActionsToProps)(githubAuth)