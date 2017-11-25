import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Timeline from './timeline/Timeline';
import styles from './TimelineContainerStyles';
import { getEntireTimeline } from '../actions/timelineActions';

/**
 * This is the container component for the Timeline panel
 */
class TimelineContainer extends Component {
  static TimelinePreference = 'SLIDING_TIMELINE';

  static propTypes = {
    getEntireTimeline: PropTypes.func.isRequired,
    classes: PropTypes.shape({
      timeline: PropTypes.string,
    }).isRequired,
  }

  componentDidMount() {
    // Loads the Timeline Data into redux state to be used in the Timeline component
    this.props.getEntireTimeline();
  }

  renderTimeline = () => {
    switch (this.TimelinePreference) {
      case 'SLIDING_TIMELINE':
        return (
          <div className={this.props.classes.timeline} >
            <Timeline />
          </div>
        );
      default:
        return (
          <Timeline />
        );
    }
  }

  render = () => this.renderTimeline()
}

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  null,
  { getEntireTimeline },
)(withStyles(styles)(TimelineContainer));

