import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import { toggleSexFilter, toggleAgeFilter, toggleLocationFilter, toggleOccupationFilter } from '../../actions/demographicActions';
import Sex from './demographics/Sex';
import Age from './demographics/Age';
import Location from './demographics/Location';
import ReportedBy from './demographics/ReportedBy';
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
      maxHeight: PropTypes.string,
    }).isRequired,
  }

  asd = () => 123;

  render() {
    return (
      <Grid container spacing={8} className={this.props.classes.gridContainer} >
        <Grid item xs={2}>
          <Paper className={this.props.classes.maxHeight} elevation={4} >
            <Sex
              sex={this.props.sex}
              toggleFilter={this.props.toggleSexFilter}
            />
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper className={this.props.classes.maxHeight} elevation={4}>
            <Age
              age={this.props.age}
              toggleFilter={this.props.toggleAgeFilter}
            />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={this.props.classes.maxHeight} elevation={4}>
            <Location
              location={this.props.location}
              toggleFilter={this.props.toggleLocationFilter}
            />
          </Paper>
        </Grid>
        <Grid item xs={3}>
          <Paper className={this.props.classes.maxHeight} elevation={4}>
            <ReportedBy
              occp_cod={this.props.occp_cod}
              toggleFilter={this.props.toggleOccupationFilter}
            />
          </Paper>
        </Grid>
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
