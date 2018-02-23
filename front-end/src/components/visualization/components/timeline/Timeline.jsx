import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Button from 'material-ui/Button';
import { setTimelineMinimizedToggle, getEntireTimeline, setSelectedDate } from '../../../../actions/timelineActions';
import styles from './TimelineStyles';
import TimelineMaximized from './components/TimelineMaximized';
import TimelineMinimized from './components/TimelineMinimized';
import './Timeline.css';

/**
 * This is the component for the Timeline visualization
 */
class Timeline extends Component {
  static propTypes = {
    getEntireTimeline: PropTypes.func.isRequired,
    setSelectedDate: PropTypes.func.isRequired,
    setTimelineMinimizedToggle: PropTypes.func.isRequired,
    minimized: PropTypes.bool.isRequired,
    entireTimelineData: PropTypes.arrayOf(
      PropTypes.shape({
        init_fda_dt: PropTypes.string.isRequired,
        serious: PropTypes.number.isRequired,
        not_serious: PropTypes.number.isRequired,
      }),
    ).isRequired,
    demographicSexData: PropTypes.array.isRequired,
    classes: PropTypes.shape({
      minimizeButton: PropTypes.string,
      timelineContainer: PropTypes.string,
      timelineContainerMinimized: PropTypes.string,
    }).isRequired,
  }

  constructor() {
    super();
    this.state = {
      selectedStartX: '0',
      selectedEndX: '0',
      previewStartX: '0',
      previewEndX: '0',
      currentlyFilteredStartDate: 0,
      currentlyFilteredEndDate: 0,
      currentlyFilteredDateRange: '03/16/2017 - 03/31/2017',
      currentlyHighlightedDateRange: '03/16/2017 - 03/31/2017',

      currentlySelecting: false,
      mouseMovePosition: '0',
      mouseZoomLocation: '0',
    };
  }

  componentWillMount() {
    // Loads the Timeline Data into redux state to be used in the Timeline component
    this.props.getEntireTimeline();
  }

  componentDidMount() {
    if (this.props.demographicSexData.length === 0) {
      this.updateDateRangePickerTextBox('03/16/2017 - 03/31/2017');
      this.updateSelectedDate()('');
    }
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
   * Create a tunnel back to this components state, so that the children can edit the state here
   */
  updateTimelineState = (updatedState) => {
    this.setState({ ...updatedState });
  }

  /**
   * Set the date range text box to the selected value by mouse
   * @param {string} dateRange formatted date range to set to textbox equal too
   */
  updateDateRangePickerTextBox = (dateRange) => {
    const datePicker = document.getElementById('dateRangePicker');
    if (datePicker.value !== dateRange) {
      datePicker.value = dateRange;
      document.getElementById('dateRangePicker').dispatchEvent(new Event('keyup'));
      this.setState({
        currentlyHighlightedDateRange: `${dateRange}`,
      });
    }
  }

  /**
   * Sets the currently selected date from the text box into the Redux State
   */
  updateSelectedDate = setDateBtnClass => () => {
    const dateRange = document.getElementById('dateRangePicker').value;
    const dates = this.getUnformattedDateFromFormattedRange(dateRange);

    // Remove Glow on set date button after it has been clicked
    document.getElementById('setDateBtn').classList.remove(setDateBtnClass);

    // When the date range changes we should update the reference area
    this.setState({
      previewStartX: `${dates.startDate}`,
      previewEndX: `${dates.endDate}`,

      currentlyFilteredStartDate: dates.startDate,
      currentlyFilteredEndDate: dates.endDate,
      currentlyFilteredDateRange: `${dateRange}`,
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
   * Toggles the size of the Timeline
   */
  toggleSize = () => {
    if (this.props.minimized) {
      this.props.setTimelineMinimizedToggle(false);
    } else {
      this.props.setTimelineMinimizedToggle(true);
    }
  }

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

  render() {
    return (
      <div
        id="TimelineContainer"
        className={`${this.props.classes.timelineContainer} ${(this.props.minimized) ? this.props.classes.timelineContainerMinimized : ''}`}
      >
        <Button id="MinimizeButtonTimeline" fab mini color="primary" aria-label="minimize" className={this.props.classes.minimizeButton} onClick={this.toggleSize}>
          {(this.props.minimized) ? '+' : '-'}
        </Button>
        {(this.props.minimized)
          ? <TimelineMinimized
            entireTimelineData={this.props.entireTimelineData}
            getmouseZoomLocation={this.getmouseZoomLocation}
            getUnformattedDateFromFormattedRange={this.getUnformattedDateFromFormattedRange}
            formatDate={this.formatDate}
            previewStartX={this.state.previewStartX}
            previewEndX={this.state.previewEndX}
          />
          : <TimelineMaximized
            entireTimelineData={this.props.entireTimelineData}
            updateTimelineState={this.updateTimelineState}
            getmouseZoomLocation={this.getmouseZoomLocation}
            getUnformattedDateFromFormattedRange={this.getUnformattedDateFromFormattedRange}
            updateDateRangePickerTextBox={this.updateDateRangePickerTextBox}
            formatDate={this.formatDate}
            formatDateRange={this.formatDateRange}
            updateSelectedDate={this.updateSelectedDate}
            recordMouseMove={this.recordMouseMove}
            {...this.state}
          />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  entireTimelineData: state.timeline.entireTimelineData,
  demographicSexData: state.demographic.sex,
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  { setTimelineMinimizedToggle, getEntireTimeline, setSelectedDate },
)(withStyles(styles)(Timeline));
