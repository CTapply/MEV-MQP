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
class App extends Component {
  static propTypes = {
    classes: PropTypes.shape({
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      demographicsMinimized: false,
      timelineMinimized: false,
    };
  }

  toggleDemographicsMinimized = (toggle) => {
    if (toggle) {
      if (this.state.timelineMinimized) {
        document.getElementById('main-visualization').setAttribute('style', 'height: calc(90vh - 52px)');
      } else {
        document.getElementById('main-visualization').setAttribute('style', 'height: calc(80vh - 52px)');
      }
    } else if (this.state.timelineMinimized) {
      document.getElementById('main-visualization').setAttribute('style', 'height: calc(75vh - 52px)');
    } else {
      document.getElementById('main-visualization').setAttribute('style', 'height: calc(65vh - 52px)');
    }
    this.setState({ demographicsMinimized: toggle });
  }

  toggleTimelineMinimized = (toggle) => {
    if (toggle) {
      if (this.state.demographicsMinimized) {
        document.getElementById('main-visualization').setAttribute('style', 'height: calc(90vh - 52px)');
      } else {
        document.getElementById('main-visualization').setAttribute('style', 'height: calc(75vh - 52px)');
      }
    } else if (this.state.demographicsMinimized) {
      document.getElementById('main-visualization').setAttribute('style', 'height: calc(80vh - 52px)');
    } else {
      document.getElementById('main-visualization').setAttribute('style', 'height: calc(65vh - 52px)');
    }
    this.setState({ timelineMinimized: toggle });
  }

  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className="App">
          <Demographics
            toggleMinimized={this.toggleDemographicsMinimized}
            minimized={this.state.demographicsMinimized}
          />
          <TreeMap />
          <Timeline
            toggleMinimized={this.toggleTimelineMinimized}
            minimized={this.state.timelineMinimized}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
