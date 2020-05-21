import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import Google from "../../components/signInMethods/googleAuth";
import Github from "../../components/signInMethods/githubAuth";
import Button from "@material-ui/core/Button";
import { Grid, Header, Icon } from "semantic-ui-react";
import { signupUser } from "../../redux/actions/actions";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { MuiThemeProvider } from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import themeObject from "../../theme/theme";
import { Link } from "react-router-dom";

const theme = createMuiTheme(themeObject);

class signUp extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      username: "",
      password: "",
      confirmPassword: "",
      errors: {},
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.UI.errors) {
      this.setState({ errors: nextProps.UI.errors });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const userData = {
      email: this.state.email,
      username: this.state.username,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword,
    };

    this.props.signupUser(userData, this.props.history);
  };
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const {
      UI: { loading },
    } = this.props;
    const { errors } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Grid container columns="3">
          <Grid.Column />
          {/* <Grid.Column style={{ marginTop: 20, background: "#a5aba2" }}> */}
          <Grid style={{ marginTop: 50, background: "#a5aba2", width: 440 }}>
            <Grid.Row
              style={{ padding: "1.2em", margin: 0 }}
              className="animated rotateInDownRight delay-1s"
            >
              <Header
                inverted
                floated="left"
                as="h2"
                className="animated pulse delay-3s"
                style={{ marginBottom: 40 }}
              >
                <span>
                  {" "}
                  <Icon name="meetup" size="huge" />
                </span>
                <Header.Content>Meet-Friends </Header.Content>
              </Header>
              <br />
              <Header
                inverted
                floated="left"
                as="h2"
                style={{ color: "#615c1e" }}
              >
                <Header.Content className="animated slideInLeft">
                  {errors.message && (
                    <Typography
                      // color="primary"
                      variant="body2"
                    >
                      {errors.message}
                    </Typography>
                  )}{" "}
                </Header.Content>
              </Header>
            </Grid.Row>
            <Grid.Row>
              <form noValidate onSubmit={this.handleSubmit} className="login">
                <TextField
                  id="email"
                  name="email"
                  type="email"
                  label="Email"
                  value={this.state.email}
                  onChange={this.handleChange}
                  helperText={errors.email}
                  error={errors.email ? true : false}
                  color="primary"
                  InputProps={{ style: { color: "#fff" } }}
                  variant="outlined"
                  fullWidth
                />{" "}
                <br />
                <TextField
                  id="username"
                  name="username"
                  type="username"
                  label="Username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  helperText={errors.username}
                  error={errors.username ? true : false}
                  color="primary"
                  InputProps={{ style: { color: "#fff" } }}
                  // variant="outlined"
                  fullWidth
                />{" "}
                <br />
                <br />
                <TextField
                  id="password"
                  name="password"
                  type="password"
                  label="Password"
                  value={this.state.password}
                  onChange={this.handleChange}
                  helperText={errors.password}
                  error={errors.password ? true : false}
                  color="primary"
                  InputProps={{ style: { color: "#fff" } }}
                  variant="outlined"
                />{" "}
                <br />
                <TextField
                  id="confirmPassword"
                  name="confirmPassword"
                  type="confirmPassword"
                  label="Confirm Password"
                  value={this.state.confirmPassword}
                  onChange={this.handleChange}
                  helperText={errors.confirmPassword}
                  error={errors.confirmPassword ? true : false}
                  color="primary"
                  InputProps={{ style: { color: "#fff" } }}
                />{" "}
                <br /> <br />
                {errors.general && (
                  <Typography variant="body2">{errors.general}</Typography>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  id="button"
                  color="primary"
                  disabled={loading}
                >
                  Signup
                  {loading && <CircularProgress size={30} disableShrink />}
                </Button>
                <br />
                <small className="">
                  Already have an account ? <Link to="/login">Login Here</Link>{" "}
                </small>
                <br />
                <span>
                  {" "}
                  <Icon name="meetup" size="huge" />
                </span>
                <Google />
                <Github />
              </form>
            </Grid.Row>
          </Grid>
        </Grid>
      </MuiThemeProvider>
    );
  }
}

signUp.propTypes = {
  user: PropTypes.object.isRequired,
  UI: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.user,
  UI: state.UI,
});

export default connect(mapStateToProps, { signupUser })(signUp);
