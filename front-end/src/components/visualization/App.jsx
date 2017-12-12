import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import TreeMap from './components/treeMap/TreeMap';
import Demographics from './components/demographics/Demographics';
import Timeline from './components/timeline/Timeline';
import MEVColors from '../../theme';

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
class App extends Component {
  static propTypes = {
    classes: PropTypes.shape({
    }).isRequired,
  }

  asd = () => 123;

  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className="App">
          <Demographics />
          <TreeMap />
          <Timeline />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
