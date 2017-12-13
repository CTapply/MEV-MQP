import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import { setUserInfo } from '../../actions/userActions';
import MEVColors from '../../theme';
import { setUserInfo, makeUserTrash, checkUserTrash } from '../../actions/userActions';

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      ...blue,
      500: MEVColors.buttonLight,
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
    checkUserTrash: PropTypes.func.isRequired,
    userID: PropTypes.number.isRequired,
    classes: PropTypes.shape({
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      type: 'none',
      message: '',
      logged_in: false,
      email: '',
    };
  }

  saveUser = () => {
    const fetchData = {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: this.state.email }),
    };
    fetch('http://localhost:3001/saveuser', fetchData)
      .then(() => {
        this.setState({
          type: 'success',
          message: 'You have successfully been addded as a new user! Logging you in...',
          logged_in: true,
        });
        this.sendFormData();
      });
  }
  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.email !== '') {
      this.setState({ type: 'info', message: 'Sending...' }, this.sendFormData);
    } else {
      this.setState({ type: 'danger', message: 'Please enter a value!' });
    }
  }
  handleChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  }
  sendFormData = () => {
    const fetchData = {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: this.state.email }),
    };
    fetch('http://localhost:3001/getuser', fetchData)
      .then(response => response.json())
      .then((user) => {
        if (user.rows.length > 0) {
          this.props.setUserInfo(true, user.rows[0].email, user.rows[0].user_id);
          if (this.props.checkUserTrash(this.props.userID)) {
            console.log('user trash found');
          } else {
            this.props.makeUserTrash(this.props.userID);
          }
          this.props.history.push('/');
        } else {
          this.setState({
            type: 'danger',
            message: 'You have not successfully logged in, but well add you as a user!',
            logged_in: true,
          });
          setTimeout(() => {
          }, 10000);
          this.saveUser();
          console.log('userid', this.props.userID);
        }
      });
  }
  asd = () => 123;

  render() {
    let result = (<div />);
    if (this.logged_in) {
      result = (<MuiThemeProvider theme={defaultTheme} >
        <div className="About container">
          <div className="row">
            <div className="col-sm-12">
              <h2>Login Page</h2>
              <p>You are already logged in!</p>
              <div id="status" className={`alert alert-${this.state.type}`}>
                {this.state.message}
              </div>
            </div>
          </div>

        </div>
      </MuiThemeProvider>);
    } else {
      result = (<MuiThemeProvider theme={defaultTheme} >
        <div className="About container">
          <div className="row">
            <div className="col-sm-12">
              <h2>Login Page</h2>
              <form className="form-horizontal" action="" onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="inputEmail3" className="col-sm-2 control-label">Email</label>
                  <div className="col-sm-6">
                    <input type="email" className="form-control" id="inputEmail3" value={this.state.value} onChange={this.handleChange} placeholder="Email" />
                  </div>
                  <div className="col-sm-4">
                    <button type="submit" className="btn btn-default">Sign in</button>
                  </div>

                </div>
              </form>
              <div id="status" className={`alert alert-${this.state.type}`}>
                {this.state.message}
              </div>
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
});

export default connect(
  mapStateToProps,
  { setUserInfo, makeUserTrash, checkUserTrash },
)(withStyles(styles)(Login));
