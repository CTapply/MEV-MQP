import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
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
            <Link to="/report"><Button raised className="cal-button" color="primary">Reports</Button></Link>
            <Timeline />
          </div>
        );
      default:
        return (
          <div>
            <Link to="/report"><Button raised className="cal-button" color="primary">Reports</Button></Link>
            <Timeline />
          </div>
        );
    }
  }

  render = () => this.renderTimeline()
}

export default withStyles(styles)(TimelineContainer);

