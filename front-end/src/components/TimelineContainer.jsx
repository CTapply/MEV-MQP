import React, { Component } from 'react';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Timeline from './timeline/Timeline';
import styles from './TimelineContainerStyles';

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
            <Link to="/report">Test</Link>
            <Timeline />
          </div>
        );
      default:
        return (
          <div>
            <Link to="/report">TestPage</Link>
            <Timeline />
          </div>
        );
    }
  }

  render = () => this.renderTimeline()
}

export default withStyles(styles)(TimelineContainer);

