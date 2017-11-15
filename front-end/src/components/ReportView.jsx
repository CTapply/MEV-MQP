import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import ReportContainer from './reports/ReportContainer';

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

class App extends Component {
  static propTypes = {
    classes: PropTypes.shape({
    }).isRequired,
  }

  asd = () => 123;

  render() {
    return (
      <MuiThemeProvider theme={blueTheme} >
        <div className="ReportView">
          <ReportContainer />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
