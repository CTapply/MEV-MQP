import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import { toggleSexFilter, toggleAgeFilter, toggleLocationFilter, toggleOccupationFilter } from '../../../../actions/demographicActions';
import Sex from './components/Sex';
import Age from './components/Age';
import Location from './components/Location';
import ReportedBy from './components/ReportedBy';
import styles from './DemographicsStyles';

/**
 * This is the container component for the Demographics panel
 */
class Demographics extends Component {
  static propTypes = {
    toggleSexFilter: PropTypes.func.isRequired,
    toggleAgeFilter: PropTypes.func.isRequired,
    toggleLocationFilter: PropTypes.func.isRequired,
    toggleOccupationFilter: PropTypes.func.isRequired,
    minimized: PropTypes.bool.isRequired,
    toggleMinimized: PropTypes.func.isRequired,
    sex: PropTypes.arrayOf(PropTypes.object).isRequired,
    age: PropTypes.arrayOf(PropTypes.object).isRequired,
    location: PropTypes.arrayOf(PropTypes.object).isRequired,
    occp_cod: PropTypes.arrayOf(PropTypes.object).isRequired,
    filters: PropTypes.shape({
      occr_country: PropTypes.array,
      sex: PropTypes.array,
    }).isRequired,
    classes: PropTypes.shape({
      gridContainer: PropTypes.string,
      minimizeButton: PropTypes.string,
      maxHeight: PropTypes.string,
    }).isRequired,
  }

  componentDidMount() {
    // Add event listener so clean up the hiding animation, but still show the whole tooltip
    document.getElementById('DemographicsGrid').addEventListener('transitionend', this.toggleOverflow);
  }
  componentWillUnmount() {
    // Remove event listener on unmount
    document.getElementById('DemographicsGrid').removeEventListener('transitionend', this.toggleOverflow);
  }

  /**
   * Toggles the overflow style on the DemographicsGrid if the Demographics panel is minimized
   */
  toggleOverflow = () => {
    if (!this.props.minimized) {
      document.getElementById('DemographicsGrid').setAttribute('style', 'overflow: visible');
    }
  }

  /**
   * Toggles the size of the Dempgraphic panel to minimize it if desired
   */
  toggleSize = () => {
    if (!this.props.minimized) {
      this.props.toggleMinimized(true);
      document.getElementById('DemographicsGrid').setAttribute('style', 'height: 5vh;');
      document.getElementById('MinimizeButton').setAttribute('style', 'top: calc(5% + 25px);');
    } else {
      this.props.toggleMinimized(false);
      document.getElementById('DemographicsGrid').setAttribute('style', 'height: 20vh;');
      document.getElementById('DemographicsGrid').setAttribute('style', 'overflow: hidden');
      document.getElementById('MinimizeButton').setAttribute('style', 'top: calc(20% + 25px);');
    }
  }

  render() {
    return (
      <Grid id="DemographicsGrid" container spacing={8} className={this.props.classes.gridContainer} >
        <Grid item xs={2}>
          <Paper className={this.props.classes.maxHeight} elevation={4} >
            <Sex
              sex={this.props.sex}
              toggleFilter={this.props.toggleSexFilter}
              minimized={this.props.minimized}
            />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={this.props.classes.maxHeight} elevation={4}>
            <Age
              age={this.props.age}
              toggleFilter={this.props.toggleAgeFilter}
              minimized={this.props.minimized}
            />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={this.props.classes.maxHeight} elevation={4}>
            <Location
              location={this.props.location}
              toggleFilter={this.props.toggleLocationFilter}
              minimized={this.props.minimized}
            />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={this.props.classes.maxHeight} elevation={4}>
            <ReportedBy
              occp_cod={this.props.occp_cod}
              toggleFilter={this.props.toggleOccupationFilter}
              minimized={this.props.minimized}
            />
          </Paper>
        </Grid>
        <Button id="MinimizeButton" fab mini color="primary" aria-label="minimize" className={this.props.classes.minimizeButton} onClick={this.toggleSize}>
          {(this.props.minimized) ? '+' : '-'}
        </Button>
      </Grid>
    );
  }
}

const mapStateToProps = state => ({
  sex: state.demographic.sex,
  age: state.demographic.age,
  location: state.demographic.location,
  occp_cod: state.demographic.occp_cod,
  filters: {
    occr_country: state.filters.occr_country,
    sex: state.filters.sex,
  },
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  { toggleSexFilter, toggleAgeFilter, toggleLocationFilter, toggleOccupationFilter },
)(withStyles(styles)(Demographics));
