import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Demograpics from './Demographics';
import SelectedDate from './SelectedDate';
import styles from './SideBarStyles';

/**
 * This is the container component for the SideBar panel
 */
class SideBar extends Component {
  static propTypes = {
    // selectedDates: PropTypes.shape({
    //   startDate: PropTypes.number.isRequired,
    //   endDate: PropTypes.number.isRequired,
    // }).isRequired,
    classes: PropTypes.shape({
      sideBar: PropTypes.string,
    }).isRequired,
  }

  asd = () => 2;

  render = () => (
      <Grid container spacing={0} className={this.props.classes.sideBar}>
        {/* <Grid item xs={12}>
          <SelectedDate
            startDate={this.props.selectedDates.startDate}
            endDate={this.props.selectedDates.endDate}
          />
        </Grid> */}
        <Grid item xs={12}>
          <Demograpics />
        </Grid>
      </Grid>
  )
}

const mapStateToProps = state => ({
  selectedDates: state.demographic.selectedDates,
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  null,
)(withStyles(styles)(SideBar));
