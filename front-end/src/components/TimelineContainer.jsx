import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Timeline from './timeline/Timeline';
import styles from './TimelineContainerStyles';

/**
 * This is the container component for the Timeline panel
 */
class TimelineContainer extends Component {
  static TimelinePreference = 'SLIDING_TIMELINE';

  static propTypes = {
    classes: PropTypes.shape({
      timeline: PropTypes.string,
    }).isRequired,
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

export default withStyles(styles)(TimelineContainer);

