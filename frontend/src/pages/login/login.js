import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField'
import Paper from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import Google from "../../components/google/googleAuth"


class login extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <Paper>
                        <Card>
                            <Google/>
                            <TextField type="email" label="Email" variant="outlined" fullWidth />
                            <TextField type="password" label="Password" variant="outlined" fullWidth />
                        </Card>
                    </Paper>
                </div>
            </div>
        )
    }
}

export default login
