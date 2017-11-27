import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import { withStyles } from 'material-ui/styles';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import CustomTooltip from './CustomTooltip';
import ClearFilterIcon from '../../../resources/clearFilterIcon.svg';

const styles = {
  labelFont: {
    'text-align': 'center',
    'font-size': '20pt',
    'pointer-events': 'none',
    'padding-left': '45px',
  },
  responsiveContainer: {
    'margin-left': '-15px',
    'font-size': '10pt',
  },
  maxHeight: {
    height: '100%',
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
    classes: PropTypes.shape({
      labelFont: PropTypes.string,
      clearFilterChip: PropTypes.string,
      chipAvatar: PropTypes.string,
      responsiveContainer: PropTypes.string,
      maxHeight: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      graphHeight: '85%',
    };

    // Listen for window resize, but wait till they have stopped to do the size calculations.
    let stillResizingTimer;
    window.addEventListener('resize', () => {
      clearTimeout(stillResizingTimer);
      stillResizingTimer = setTimeout(this.resizeGraph, 250);
    });
  }

  componentDidMount() {
    this.resizeGraph();
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
    const container = document.getElementById('location-container');
    const containerHeight = window.getComputedStyle(container, null).getPropertyValue('height');
    const graphTitle = document.getElementById('location-graph-title');
    const graphTitleHeight = window.getComputedStyle(graphTitle, null).getPropertyValue('height');
    this.setState({
      graphHeight: (parseInt(containerHeight, 10) - parseInt(graphTitleHeight, 10)) + 10,
    });
  }

  render() {
    return (
      <div id="location-container" className={this.props.classes.maxHeight} >
        <Chip
          avatar={<Avatar src={ClearFilterIcon} alt="Clear Filters" className={this.props.classes.chipAvatar} />}
          label="Clear Filter"
          onClick={this.clearFilter}
          className={this.props.classes.clearFilterChip}
        />
        <Typography id="location-graph-title" className={this.props.classes.labelFont} type="title" component="h1">
          Location
        </Typography>
        <ResponsiveContainer className={this.props.classes.responsiveContainer} width="100%" height={this.state.graphHeight}>
          <BarChart
            data={this.props.location}
            onClick={this.handleFilterClickToggle}
          >
            {/* <defs>
              <linearGradient id="colorSevere" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#DA2536" stopOpacity={0.8} />
                <stop offset="99%" stopColor="#AB1D2A" stopOpacity={0.6} />
              </linearGradient>
            </defs> */}
            <XAxis dataKey="country" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#424242', strokeWidth: 1 }}
              wrapperStyle={{ padding: '4px', zIndex: 1000 }}
              demographic="country"
            />
            <Bar dataKey="serious" stroke="#1A237E" stackId="a" fill="url(#colorSevere)" />
            <Bar dataKey="UNK" stroke="#424242" stackId="a" fill="url(#colorNotSerious)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Location);
