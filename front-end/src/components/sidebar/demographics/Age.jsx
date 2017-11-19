import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, ResponsiveContainer } from 'recharts';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import CustomTooltip from './CustomTooltip';

const styles = {
  labelFont: {
    'font-size': '20pt',
  },
  responsiveContainer: {
    'margin-left': '-15px',
    'font-size': '10pt',
  },
  maxHeight: {
    height: '100%',
  },
};

/**
 * This is the component that displays the Age Demographic visualization
 */
class Age extends Component {
  static propTypes = {
    age: PropTypes.arrayOf(PropTypes.object).isRequired,
    toggleFilter: PropTypes.func.isRequired,    
    classes: PropTypes.shape({
      labelFont: PropTypes.string,
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
    const container = document.getElementById('age-container');
    const containerHeight = window.getComputedStyle(container, null).getPropertyValue('height');
    const graphTitle = document.getElementById('age-graph-title');
    const graphTitleHeight = window.getComputedStyle(graphTitle, null).getPropertyValue('height');
    this.setState({
      graphHeight: (parseInt(containerHeight, 10) - parseInt(graphTitleHeight, 10)) + 10,
    });
  }

  render() {
    return (
      <div id="age-container" className={this.props.classes.maxHeight} >
        <Typography id="age-graph-title" className={this.props.classes.labelFont} type="title" align="center" component="h1">
          Age
        </Typography>
        <ResponsiveContainer className={this.props.classes.responsiveContainer} width="100%" height={this.state.graphHeight}>
          <BarChart
            data={this.props.age}
            onClick={this.handleFilterClickToggle}
          >
            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#283593" stopOpacity={0.8} />
                <stop offset="99%" stopColor="#283593" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis dataKey="age" tickCount={13} />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: '#424242', strokeWidth: 1 }}
              wrapperStyle={{ padding: '4px' }}
              demographic="age"
            />
            <Bar dataKey="serious" stroke="#1A237E" stackId="a" fill="url(#colorBlue)" />
            <Bar dataKey="UNK" stroke="#424242" stackId="a" fill="url(#colorGrey)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Age);
