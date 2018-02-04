import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import MaterialTooltip from 'material-ui/Tooltip';
import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer, ReferenceArea } from 'recharts';
import BrushImpl from './components/BrushImpl';
import styles from './TimelineMinimizedStyles';
import GoToReportsIcon from '../../../../../resources/goToReportsIcon.svg';
import MEVColors from '../../../../../theme';
import '../Timeline.css';

/**
 * This is the component for the Timeline visualization
 */
class TimelineMinimized extends Component {
  static propTypes = {
    entireTimelineData: PropTypes.arrayOf(PropTypes.shape({
      init_fda_dt: PropTypes.string.isRequired,
      serious: PropTypes.number.isRequired,
      not_serious: PropTypes.number.isRequired,
    })).isRequired,
    getmouseZoomLocation: PropTypes.func.isRequired,
    getUnformattedDateFromFormattedRange: PropTypes.func.isRequired,
    formatDate: PropTypes.func.isRequired,

    previewStartX: PropTypes.string.isRequired,
    previewEndX: PropTypes.string.isRequired,

    classes: PropTypes.shape({
      dateSelectedTextField: PropTypes.string,
      gridContainer: PropTypes.string,
      timelineChartWrapperMinimized: PropTypes.string,
      timelineChartMinimized: PropTypes.string,
      nonSetDateButton: PropTypes.string,
      reportsButtonWrapperMaximized: PropTypes.string,
      setDateButton: PropTypes.string,
      unselectedSetDateButton: PropTypes.string,
      goToReportsButton: PropTypes.string,
      reportsButtonSVG: PropTypes.string,
      tooltipStyle: PropTypes.string,
    }).isRequired,
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
      <AreaChart
        data={this.loadingData()}
        margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorNotSerious" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor={MEVColors.notSevereDark} stopOpacity={1} />
            <stop offset="99%" stopColor={MEVColors.notSevereLight} stopOpacity={1} />
          </linearGradient>
          <linearGradient id="colorSevere" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor={MEVColors.severeDark} stopOpacity={0.8} />
            <stop offset="99%" stopColor={MEVColors.severeLight} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="init_fda_dt"
          tickFormatter={this.loading}
          minTickGap={15}
        />
        <CartesianGrid strokeDasharray="3 3" />
      </AreaChart>
    </ResponsiveContainer>
  )

  renderTimeline = () => (
    <ResponsiveContainer width="100%" height="100%" >
      <AreaChart
        data={this.props.entireTimelineData}
        margin={{ top: 2, right: 2, left: 2, bottom: -25 }}
      >
        <defs>
          <linearGradient id="colorNotSerious" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor={MEVColors.notSevereDark} stopOpacity={0.8} />
            <stop offset="99%" stopColor={MEVColors.notSevereLight} stopOpacity={0.8} />
          </linearGradient>
          <linearGradient id="colorSevere" x1="0" y1="0" x2="0" y2="1">
            <stop offset="15%" stopColor={MEVColors.severeDark} stopOpacity={0.8} />
            <stop offset="99%" stopColor={MEVColors.severeLight} stopOpacity={0.8} />
          </linearGradient>
        </defs>
        <ReferenceArea
          x1={this.props.previewStartX}
          x2={this.props.previewEndX}
          stroke="red"
          strokeOpacity={0.3}
          xAxisId={0}
        />
        <XAxis
          dataKey="init_fda_dt"
          tickFormatter={this.props.formatDate}
          minTickGap={15}
          style={{ display: 'none' }}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Area
          type="monotone"
          dataKey="serious"
          stroke={MEVColors.severeStroke}
          fillOpacity={1}
          stackId="1"
          fill="url(#colorSevere)"
          animationDuration={700}
          connectNulls={false}
        />
        <Area
          type="monotone"
          dataKey="not_serious"
          stroke={MEVColors.notSevereStroke}
          fillOpacity={1}
          stackId="1"
          fill="url(#colorNotSerious)"
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
          getmouseZoomLocation={this.props.getmouseZoomLocation}
          getUnformattedDateFromFormattedRange={this.props.getUnformattedDateFromFormattedRange}
        />
      </AreaChart>
    </ResponsiveContainer>
  )

  render() {
    return (
      <Grid
        id="TimelineGrid"
        container
        spacing={8}
        className={this.props.classes.gridContainer}
      >
        <Paper
          elevation={4}
          className={this.props.classes.timelineChartWrapperMinimized}
        >
          <div className={this.props.classes.timelineChartMinimized} id="timeline-chart" >
            {(this.props.entireTimelineData.length > 1)
              ? this.renderTimeline()
              : this.renderLoading()}
          </div>
        </Paper>
        <Paper elevation={4} className={this.props.classes.reportsButtonWrapperMaximized} >
          <MaterialTooltip
            title="Go to Reports Listing"
            placement="top"
            enterDelay={50}
            classes={{
              tooltip: this.props.classes.tooltipStyle,
              popper: this.props.classes.tooltipStyle,
              }}
          >
            <Link to="/report">
              <Button raised className={this.props.classes.goToReportsButton} color="primary" >
                <img className={this.props.classes.reportsButtonSVG} src={GoToReportsIcon} alt="Go to Reports Listing" />
              </Button>
            </Link>
          </MaterialTooltip>
          <Button raised color="primary" id="setDateBtn" style={{ display: 'none' }} >Set Date!</Button>
          <TextField className={this.props.classes.dateSelectedTextField} label="Selected Date Range" defaultValue="03/16/2017 - 03/31/2017" id="dateRangePicker" style={{ display: 'none' }} />
        </Paper>
      </Grid>
    );
  }
}

export default withStyles(styles)(TimelineMinimized);
