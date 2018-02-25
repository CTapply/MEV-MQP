import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { setUserInfo, makeUserTrash, makeUserRead, checkUserTrash, checkUserRead } from '../../actions/userActions';
import MEVColors from '../../theme';

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      ...blue,
      500: MEVColors.buttonLight,
      700: MEVColors.buttonHover,
    },
    secondary: {
      ...green,
    },
    ...MEVColors,
    error: red,
  },
});

const styles = theme => ({});

/**
 * This is the component for the App
 */
class Login extends Component {
  static propTypes = {
    setUserInfo: PropTypes.func.isRequired,
    makeUserTrash: PropTypes.func.isRequired,
    makeUserRead: PropTypes.func.isRequired,
    checkUserTrash: PropTypes.func.isRequired,
    checkUserRead: PropTypes.func.isRequired,
    userID: PropTypes.number.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      type: 'none',
      message: '',
      logged_in: false,
      username: '',
    };
  }

  componentDidMount() {
    if (this.props.isLoggedIn) {
      window.location = '/visualization';
    }
  }

  saveUser = () => {
    const fetchData = {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: this.state.username }),
    };
    fetch(`${process.env.REACT_APP_NODE_SERVER}/saveuser`, fetchData)
      .then(() => {
        this.setState({
          type: 'success',
          message: 'Logging you in...',
          logged_in: true,
        });
        this.sendFormData();
      });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.username !== '') {
      this.setState({ type: 'info', message: 'Sending...' }, this.sendFormData);
    } else {
      this.setState({ type: 'danger', message: 'Please enter a username!' });
    }
  }

  handleChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  }

  sendFormData = () => {
    const fetchData = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: this.state.username }),
    };

    fetch(`${process.env.REACT_APP_NODE_SERVER}/getuser`, fetchData)
      .then(response => response.json())
      .then((user) => {
        if (user.rows.length > 0) {
          this.props.setUserInfo(true, user.rows[0].email, user.rows[0].user_id);
          const createDefaultCases = [];
          createDefaultCases.push(this.props.checkUserTrash(user.rows[0].user_id)
            .then((trashFound) => {
              if (trashFound) {
                return Promise.resolve();
              }
              return this.props.makeUserTrash(user.rows[0].user_id);
            }));
          createDefaultCases.push(this.props.checkUserRead(user.rows[0].user_id)
            .then((readFound) => {
              if (readFound) {
                return Promise.resolve();
              }
              return this.props.makeUserRead(user.rows[0].user_id);
            }));

          Promise.all(createDefaultCases)
            .then(() => {
              this.props.history.push('/dashboard');
            });
        } else {
          this.setState({
            type: 'info',
            message: 'creating a new user',
          });

          this.saveUser();
        }
      });
  }

  render() {
    let result = (<div />);
    if (this.state.logged_in) {
      result = (
        <MuiThemeProvider theme={defaultTheme} >
          <div className="About container">
            <div className="row">
              <div className="col-sm-12">
                <h2>Login</h2>
                <p>You are already logged in!</p>
                <div id="status" className={`alert alert-${this.state.type}`}>
                  {this.state.message}
                </div>
              </div>
            </div>
          </div>
        </MuiThemeProvider>);
    } else {
      result = (
        <MuiThemeProvider theme={defaultTheme} >
          <div className="About container">
            <div className="row">
              <div className="col-sm-12">
                <Paper elevation={2} style={{ padding: '20px 20px 20px 20px', marginTop: '15px' }} >
                  <Typography type="title" style={{ fontSize: '30px', color: '#333' }}>
                    Sign in to Get Started
                  </Typography>
                  <Typography type="subheading" style={{ fontSize: '16px', color: '#333' }}>
                    <i>Please enter a username to be directed to the system</i>
                  </Typography>
                  <br />
                  <div className="col-sm-8 col-sm-offset-2">
                    <form className="form-horizontal" action="" onSubmit={this.handleSubmit}>
                      <div className="form-group">
                        <div className="col-sm-10">
                          <input className="form-control" id="inputUsername3" value={this.state.value} onChange={this.handleChange} placeholder="Username" />
                        </div>
                        <div className="col-sm-2">
                          <button type="submit" className="btn btn-default">Sign in</button>
                        </div>

                      </div>
                    </form>
                  </div>
                  <div id="status" className={`alert alert-${this.state.type}`} style={{ marginTop: '45px', marginBottom: '0px' }}>
                    {this.state.message}
                  </div>
                </Paper>
              </div>
            </div>

          </div>
        </MuiThemeProvider>);
    }
    return (result);
  }
}

const mapStateToProps = state => ({
  userID: state.user.userID,
  isLoggedIn: state.user.isLoggedIn,
});

export default connect(
  mapStateToProps,
  { setUserInfo, makeUserTrash, makeUserRead, checkUserTrash, checkUserRead },
)(withStyles(styles)(Login));
