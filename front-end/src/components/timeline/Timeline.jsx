import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { Area, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import AreaChartImpl from './components/AreaChartImpl';
import BrushImpl from './components/BrushImpl';
import { setSelectedDate } from '../../actions/timelineActions';
import styles from './TimelineStyles';
import './Timeline.css';

/**
 * This is the component for the Timeline visualization
 */
class Timeline extends Component {
  static propTypes = {
    setSelectedDate: PropTypes.func.isRequired,
    entireTimelineData: PropTypes.arrayOf(
      PropTypes.shape({
        init_fda_dt: PropTypes.string.isRequired,
        serious: PropTypes.number.isRequired,
        not_serious: PropTypes.number.isRequired,
      }),
    ).isRequired,
    classes: PropTypes.shape({
      dateSelectedTextField: PropTypes.string,
      gridContainer: PropTypes.string,
      timelineChartWrapper: PropTypes.string,
      timelineChart: PropTypes.string,
      calendartWrapper: PropTypes.string,
    }).isRequired,
  }

  constructor() {
    super();
    this.state = {
      selectedStartX: 0,
      selectedEndX: 0,
      previewStartX: 0,
      previewEndX: 0,

      currentlySelecting: false,
      mouseMovePosition: 0,
      mouseZoomLocation: 0,
    };
  }

  componentDidMount() {
    // Add listener for when the user clicks and drags to select a time range for filtering.
    document.getElementById('timeline-chart').addEventListener('mousedown', (e) => {
      this.setState({
        currentlySelecting: true,
        selectedStartX: this.state.mouseMovePosition,
        previewStartX: this.state.mouseMovePosition,
      });

      const dateRange = this.formatDateRange(this.state.selectedStartX, this.state.selectedStartX);
      document.getElementById('dateRangePicker').value = dateRange;

      // Clear  the Other end to start a new selection TODO
      this.setState({
        selectedEndX: 0,
        previewEndX: 0,
      });
      e.preventDefault();
    }, false);

    // Add listener for when the user clicks and drags to select a time range for filtering.
    document.getElementById('timeline-chart').addEventListener('mouseup', () => {
      let dateRange;
      const previewEndXVal = (this.state.mouseMovePosition === this.state.selectedStartX)
        ? Number(this.state.mouseMovePosition) + 1
        : this.state.mouseMovePosition;
      this.setState({
        currentlySelecting: false,
        selectedEndX: this.state.mouseMovePosition,
        previewEndX: previewEndXVal,
      });

      if (this.state.selectedEndX > this.state.selectedStartX) {
        dateRange = this.formatDateRange(this.state.selectedStartX, this.state.selectedEndX);
        document.getElementById('dateRangePicker').value = dateRange;
      } else {
        dateRange = this.formatDateRange(this.state.selectedEndX, this.state.selectedStartX);
        document.getElementById('dateRangePicker').value = dateRange;
      }
      const event = new Event('keyup');
      document.getElementById('dateRangePicker').dispatchEvent(event);
    }, false);

    // Add listener for when the user clicks and drags to select a time range for filtering.
    document.getElementById('timeline-chart').addEventListener('mousemove', () => {
      let dateRange;
      if (this.state.currentlySelecting) {
        if (this.state.previewEndX !== this.state.mouseMovePosition) {
          this.setState({ previewEndX: this.state.mouseMovePosition });
        }
        if (this.state.previewEndX > this.state.selectedStartX) {
          dateRange = this.formatDateRange(this.state.selectedStartX, this.state.previewEndX);
          document.getElementById('dateRangePicker').value = dateRange;
        } else if (this.state.previewEndX === this.state.selectedStartX) {
          dateRange = this.formatDateRange(this.state.selectedStartX, this.state.previewEndX);
          document.getElementById('dateRangePicker').value = dateRange;
        } else {
          dateRange = this.formatDateRange(this.state.previewEndX, this.state.selectedStartX);
          document.getElementById('dateRangePicker').value = dateRange;
        }
      }
    }, true);
  }

  /**
   * Returns the current location of the mouse (relative to the Graph)
   */
  getmouseZoomLocation = () => this.state.mouseZoomLocation;

  /**
   * Parses the Formatted date range string and returns an object with unformatted dates
   * @param {string} dateRange Formatted date as dd/mm/yyyy - dd/mm/yyyy
   * @return {object} containing the startDate as yyyymmdd and the endDate as yyyymmdd
   */
  getUnformattedDateFromFormattedRange = (dateRange) => {
    const splitRange = dateRange.split(' ');
    const formattedStart = splitRange[0];
    const formattedEnd = splitRange[2];

    const splitFormattedStart = formattedStart.split('/');
    const splitFormattedEnd = formattedEnd.split('/');

    return {
      startDate: `${splitFormattedStart[2]}${splitFormattedStart[0]}${splitFormattedStart[1]}`,
      endDate: `${splitFormattedEnd[2]}${splitFormattedEnd[0]}${splitFormattedEnd[1]}`,
    };
  }

  /**
   * Sets the currently selected date from the text box into the Redux State
   */
  updateSelectedDate = () => {
    const dateRange = document.getElementById('dateRangePicker').value;
    const dates = this.getUnformattedDateFromFormattedRange(dateRange);

    // When the date range changes we should update the reference area
    this.setState({
      previewStartX: dates.startDate,
      previewEndX: dates.endDate,
    });

    this.props.setSelectedDate({
      ...dates,
    });
  };

  /**
   * Parses an unformatted date into a formatted date
   * @param {string} date Unformatted date as yyyymmddd
   * @return {string} Formatted date as dd/mm/yyyy
   */
  formatDate = (date) => {
    const dateString = `${date}`;
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${month}/${day}/${year}`;
  }

  /**
   * Combines two formatted dates into a formatted date range
   * @param {string} startDate Formatted date as dd/mm/yyyy
   * @param {string} endDate Formatted date as dd/mm/yyyy
   * @return {string} Formatted date range as dd/mm/yyyy - dd/mm/yyyy
   */
  formatDateRange = (startDate, endDate) => `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`

  /**
   * Records the current Mouse position and saves it to local state
   */
  recordMouseMove = (e) => {
    if (e && e.activeLabel) {
      if (this.state.mouseMovePosition !== e.activeLabel) {
        this.setState({ mouseMovePosition: e.activeLabel, mouseZoomLocation: e.chartX });
      }
    }
  }

  /**
   * Dummy data that is used to show an empty graph while the timeline is loading
   */
  loadingData = () => [
    { loading: 1 },
    { loading: 2 },
    { loading: 3 },
    { loading: 4 },
    { loading: 5 },
    { loading: 6 },
    { loading: 7 },
    { loading: 8 },
  ];

  renderLoading = () => (
    <ResponsiveContainer width="100%" height="100%" >
      <AreaChartImpl
        data={this.loadingData()}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        onMouseMove={this.recordMouseMove}
      >
        <defs>
          <linearGradient id="colorGrey" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#757575" stopOpacity={0.8} />
            <stop offset="99%" stopColor="#757575" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#283593" stopOpacity={0.8} />
            <stop offset="99%" stopColor="#283593" stopOpacity={0.2} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="init_fda_dt"
          tickFormatter={this.loading}
          minTickGap={15}
        />
        <CartesianGrid strokeDasharray="3 3" />
      </AreaChartImpl>
    </ResponsiveContainer>
  )

  renderTimeline = () => (
    <ResponsiveContainer width="100%" height="100%" >
      <AreaChartImpl
        data={this.props.entireTimelineData}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        onMouseMove={this.recordMouseMove}
      >
        <defs>
          <linearGradient id="colorGrey" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#757575" stopOpacity={0.8} />
            <stop offset="99%" stopColor="#757575" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#283593" stopOpacity={0.8} />
            <stop offset="99%" stopColor="#283593" stopOpacity={0.2} />
          </linearGradient>
          <linearGradient id="colorBlue1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#3D51DF" stopOpacity={0.8} />
            <stop offset="99%" stopColor="#3D51DF" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="colorBlue2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#283593" stopOpacity={0.8} />
            <stop offset="99%" stopColor="#283593" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="colorBlue3" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#171E53" stopOpacity={0.8} />
            <stop offset="99%" stopColor="#171E53" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="colorBlue4" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#2B3AA0" stopOpacity={0.8} />
            <stop offset="99%" stopColor="#2B3AA0" stopOpacity={0.6} />
          </linearGradient>
          <linearGradient id="colorBlue5" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor="#212C79" stopOpacity={0.8} />
            <stop offset="99%" stopColor="#212C79" stopOpacity={0.6} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="init_fda_dt"
          tickFormatter={this.formatDate}
          minTickGap={15}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          offset={50}
          animationDuration={0}
          labelFormatter={this.formatDate}
          wrapperStyle={{ padding: '4px' }}
        />
        <Area
          type="monotone"
          dataKey="serious"
          stroke="#1A237E"
          fillOpacity={1}
          stackId="1"
          fill="url(#colorBlue)"
          animationDuration={700}
          connectNulls={false}
        />
        <Area
          type="monotone"
          dataKey="not_serious"
          stroke="#424242"
          fillOpacity={1}
          stackId="1"
          fill="url(#colorGrey)"
          animationDuration={700}
          connectNulls={false}
        />
        <BrushImpl
          dataKey="init_fda_dt"
          stroke="#8884d8"
          height={1}
          travellerWidth={10}
          startIndex={this.props.entireTimelineData.length - 30}
          endIndex={this.props.entireTimelineData.length - 1}
          getmouseZoomLocation={this.getmouseZoomLocation}
          getUnformattedDateFromFormattedRange={this.getUnformattedDateFromFormattedRange}
        />
        <ReferenceArea
          x1={this.state.previewStartX}
          x2={this.state.previewEndX}
          stroke="red"
          strokeOpacity={0.3}
          xAxisId={0}
        />
      </AreaChartImpl>
    </ResponsiveContainer>
  )

  render = () => (
    <Grid container spacing={8} className={this.props.classes.gridContainer}>
      <Grid item sm={3} md={2}>
        <Paper elevation={4} className={this.props.classes.calendartWrapper} >
          <Button raised className="cal-button" color="primary" onClick={this.updateSelectedDate} id="setDateBtn" >Set Date!</Button>
          <TextField className={this.props.classes.dateSelectedTextField} label="Selected Date Range" defaultValue="asd" id="dateRangePicker" />
        </Paper>
      </Grid>
      <Grid item sm={9} md={10}>
        <Paper elevation={4} className={this.props.classes.timelineChartWrapper} >
          <div className={this.props.classes.timelineChart} id="timeline-chart" >
            {(this.props.entireTimelineData.length > 1) ? this.renderTimeline() : this.renderLoading()}
          </div>
        </Paper>
      </Grid>
    </Grid>
  )
}

const mapStateToProps = state => ({
  entireTimelineData: state.timeline.entireTimelineData,
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  { setSelectedDate },
)(withStyles(styles)(Timeline));
