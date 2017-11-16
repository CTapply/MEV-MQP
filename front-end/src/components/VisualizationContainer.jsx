import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import StackedBarVisualization from './visualizations/StackedBarVisualization';
import styles from './VisualizationContainerStyles';

/**
 * This is the container component for the Main Visualization panel
 */
class VisualizationContainer extends Component {
  static visualizationPreference = 'STACKED_BAR';

  static propTypes = {
    classes: PropTypes.shape({
      mainVisualization: PropTypes.string,
    }).isRequired,
  }

  renderVisualization = () => {
    switch (this.visualizationPreference) {
      case 'STACKED_BAR':
        return (
          <StackedBarVisualization />
        );
      default:
        return (
          <StackedBarVisualization />
        );
    }
  }

  render = () => (
    <div className={this.props.classes.mainVisualization} >
      {this.renderVisualization()}
    </div>
  )
}

export default withStyles(styles)(VisualizationContainer);
