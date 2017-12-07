import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import { setUserInfo } from '../actions/userActions';


const blueTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      ...green,
      A400: '#00e677',
    },
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
        setTimeout(() => {
          this.setState({
            type: 'success',
            message: 'You have successfully been addded as a new user! Logging you in...',
            logged_in: true,
          });
        }, 3000);
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
          this.props.history.push("/");
        } else {
          this.setState({
            type: 'danger',
            message: 'You have not successfully logged in, but well add you as a user!',
            logged_in: true,
          });
          this.saveUser();
        }
      });
  }
  asd = () => 123;

  render() {
    let result = (<div />);
    if (this.logged_in) {
      result = (<MuiThemeProvider theme={blueTheme} >
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
      result = (<MuiThemeProvider theme={blueTheme} >
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
  sex: state.demographic.sex,
  age: state.demographic.age,
});

export default connect(
  mapStateToProps,
  { setUserInfo },
)(withStyles(styles)(Login));
