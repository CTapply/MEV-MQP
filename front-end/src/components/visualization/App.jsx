import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import TreeMap from './components/treeMap/TreeMap';
import Demographics from './components/demographics/Demographics';
import { setCurrentlySelecting } from '../../actions/filterActions';
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
    setCurrentlySelecting: PropTypes.func.isRequired,
    timelineMinimized: PropTypes.bool.isRequired,
    demographicsMinimized: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
    }).isRequired,
  }

  componentWillMount() {
    if (!this.props.isLoggedIn) {
      window.location = '/';
    }
  }
  
  componentDidMount() {
    window.addEventListener('keydown', this.setSelectingBool);
    window.addEventListener('keyup', this.removeSelectingBool);
  }
  
  componentWillUnmount() {
    window.removeEventListener('keydown', this.setSelectingBool);
    window.removeEventListener('keyup', this.removeSelectingBool);
  }

  setSelectingBool = (e) => {
    if (e.keyCode === 16) {
      window.addEventListener('mousedown', this.stopClick);
      this.props.setCurrentlySelecting(true);
    }
  }

  removeSelectingBool = (e) => {
    if (e.keyCode === 16) {
      window.removeEventListener('mousedown', this.stopClick);
      this.props.setCurrentlySelecting(false);
    }
  }

  stopClick = (e) => {
    const parentGroupID = e.target.getAttribute('parentgroupid');
    const closestGroupTag = e.target.closest(`g#${parentGroupID}`);
    if (closestGroupTag) {
      const prevStyles = closestGroupTag.getAttribute('style');
      if (!prevStyles) {
        closestGroupTag.setAttribute('style', 'filter: url(#selectedShadow)');
      } else {
        closestGroupTag.setAttribute('style', '');
      }
    }
    e.preventDefault();
  }

  calculateTreeMapHeight = () => {
    if (this.props.demographicsMinimized) {
      if (this.props.timelineMinimized) {
        return 'calc(90vh - 52px)';
      }
      return 'calc(80vh - 52px)';
    } else if (this.props.timelineMinimized) {
      return 'calc(75vh - 52px)';
    }
    return 'calc(65vh - 52px)';
  }


  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className="App">
          <Demographics
            minimized={this.props.demographicsMinimized}
          />
          <TreeMap
            mainVisHeight={this.calculateTreeMapHeight()}
          />
          <Timeline
            minimized={this.props.timelineMinimized}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  timelineMinimized: state.timeline.timelineMinimized,
  demographicsMinimized: state.demographic.demographicsMinimized,
  isLoggedIn: state.user.isLoggedIn,
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  { setCurrentlySelecting },
)(withStyles(styles)(App));
