import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import CustomTooltip from './components/CustomTooltip';
import ClearFilterIcon from '../../../../../resources/clearFilterIcon.svg';
import MEVColors from '../../../../../theme';

const styles = {
  labelFont: {
    'text-align': 'center',
    'font-size': '20pt',
    'pointer-events': 'none',
    'padding-left': '45px',
  },
  responsiveContainerMaximized: {
    'margin-left': '-15px',
    'font-size': '10pt',
    zIndex: 450,
  },
  responsiveContainerMinimized: {
    'margin-left': '0px',
    'font-size': '10pt',
    transform: 'translateY(-3px)',
    zIndex: 450,
  },
  maxHeight: {
    height: '100%',
  },
  noOverflow: {
    overflow: 'hidden',
  },
  clearFilterChip: {
    'font-size': '9pt',
    height: '14pt',
    float: 'right',
    transform: 'translateY(8px) translateX(-5px)',
  },
  chipAvatar: {
    height: '11pt',
    width: '11pt',
    transform: 'translateX(3px)',
  },
};

/**
 * This is the component that displays the Location Demographic visualization
 */
class Location extends Component {
  static propTypes = {
    location: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleFilter: PropTypes.func.isRequired,
    minimized: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
      labelFont: PropTypes.string,
      clearFilterChip: PropTypes.string,
      chipAvatar: PropTypes.string,
      responsiveContainerMaximized: PropTypes.string,
      responsiveContainerMinimized: PropTypes.string,
      maxHeight: PropTypes.string,
      noOverflow: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      graphHeight: '85%',
      stillResizingTimer: '',
    };
  }

  componentDidMount() {
    this.resizeGraph();

    // Listen for window resize, but wait till they have stopped to do the size calculations.
    window.addEventListener('resize', this.resizeTimer);

    // Resize the treemaps when the main-visualization size is changed
    document.getElementById('DemographicsGrid').addEventListener('transitionend', this.resizeGraph);
  }

  componentWillUnmount() {
    // Remove the event listeners when unmounting
    window.removeEventListener('resize', this.resizeTimer);
    document.getElementById('DemographicsGrid').removeEventListener('transitionend', this.resizeGraph);
  }

  /**
   * After 250ms of not resizing, we will then resize the graph (this improves performance)
   */
  resizeTimer = () => {
    clearTimeout(this.state.stillResizingTimer);
    this.setState({ stillResizingTimer: setTimeout(this.resizeGraph, 250) });
  }

  /**
   * Clears all of the currently selected filters for this component
   */
  clearFilter = () => {
    this.props.toggleFilter('CLEAR');
  }

  /**
   * Toggles the filter in Redux State for the bar clicked on in the chart
   */
  handleFilterClickToggle = (e) => {
    if (e && e.activeLabel) {
      this.props.toggleFilter(e.activeLabel);
    }
  }

  /**
   * Calculates the best size for the visualization for better scalability
   */
  resizeGraph = () => {
    if (!this.props.minimized) {
      const container = document.getElementById('location-container');
      const containerHeight = window.getComputedStyle(container, null).getPropertyValue('height');
      const graphTitle = document.getElementById('location-graph-title');
      let graphTitleHeight;
      if (graphTitle) {
        graphTitleHeight = window.getComputedStyle(graphTitle, null).getPropertyValue('height');
      }
      this.setState({
        graphHeight: (parseInt(containerHeight, 10) - parseInt(graphTitleHeight || 31, 10)) + 15,
      });
    } else {
      const container = document.getElementById('location-container');
      const containerHeight = window.getComputedStyle(container, null).getPropertyValue('height');
      this.setState({
        graphHeight: (parseInt(containerHeight, 10) + 4),
      });
    }
  }

  renderMinimized = () => {
    return (
      <div id="location-container" className={this.props.classes.maxHeight} >
        <ResponsiveContainer className={this.props.classes.responsiveContainerMinimized} width="100%" height={this.state.graphHeight} >
          <BarChart
            data={this.props.location}
          >
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#424242', strokeWidth: 1 }}
              wrapperStyle={{ padding: '4px', zIndex: 1000 }}
              demographic="country"
              isAnimationActive={false}
            />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="serious" stroke={MEVColors.severeStroke} stackId="a" fill="url(#colorSevere)" />
            <Bar dataKey="UNK" stroke={MEVColors.notSevereStroke} stackId="a" fill="url(#colorNotSerious)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  renderMaximized = () => {
    return (
      <div id="location-container" className={this.props.classes.maxHeight} >
        <div id="location-header" className={this.props.classes.noOverflow} >
          <Chip
            avatar={<Avatar src={ClearFilterIcon} alt="Clear Filters" className={this.props.classes.chipAvatar} />}
            label="Clear Filter"
            onClick={this.clearFilter}
            className={this.props.classes.clearFilterChip}
          />
          <Typography id="location-graph-title" className={this.props.classes.labelFont} type="title" component="h1">
            Location
          </Typography>
        </div>
        <ResponsiveContainer className={this.props.classes.responsiveContainerMaximized} width="100%" height={this.state.graphHeight}>
          <BarChart
            data={this.props.location}
            onClick={this.handleFilterClickToggle}
          >
            <XAxis dataKey="country" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              content={<CustomTooltip />}
              offset={15}
              cursor={{ stroke: '#424242', strokeWidth: 1 }}
              wrapperStyle={{ padding: '4px', zIndex: 1000 }}
              demographic="country"
              isAnimationActive={false}
            />
            <Bar dataKey="serious" stroke={MEVColors.severeStroke} stackId="a" fill="url(#colorSevere)" />
            <Bar dataKey="UNK" stroke={MEVColors.notSevereStroke} stackId="a" fill="url(#colorNotSerious)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  render() {
    return (this.props.minimized)
      ? this.renderMinimized()
      : this.renderMaximized();
  }
}

export default withStyles(styles)(Location);
