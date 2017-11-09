import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

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

class Location extends Component {
  static propTypes = {
    location: PropTypes.arrayOf(PropTypes.object).isRequired,
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

    let stillResizingTimer;
    window.addEventListener('resize', () => {
      clearTimeout(stillResizingTimer);
      stillResizingTimer = setTimeout(this.resizeGraph, 250);
    });
  }

  componentDidMount() {
    this.resizeGraph();
  }

  handleClick = (e) => {
    if (e && e.activeLabel) {
      this.props.toggleFilter(e.activeLabel);
    }
  }

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
        <Typography id="location-graph-title" className={this.props.classes.labelFont} type="title" align="center" component="h1">
          Location
        </Typography>
        <ResponsiveContainer className={this.props.classes.responsiveContainer} width="100%" height={this.state.graphHeight}>
          <BarChart
            data={this.props.location}
            onClick={this.handleClick}
          >
            <defs>
              <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="15%" stopColor="#283593" stopOpacity={0.8} />
                <stop offset="99%" stopColor="#283593" stopOpacity={0.4} />
              </linearGradient>
            </defs>
            <XAxis dataKey="country" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip
              cursor={{ stroke: '#424242', strokeWidth: 1 }}
              wrapperStyle={{ padding: '4px' }}
            />
            <Bar dataKey="count" stroke="#1A237E" fill="url(#colorBlue)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default withStyles(styles)(Location);
