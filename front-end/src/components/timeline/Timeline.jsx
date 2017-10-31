import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import { FormGroup, InputGroup, FormControl } from 'react-bootstrap';
import { Area, CartesianGrid, XAxis, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import AreaChartImpl from './components/AreaChartImpl';
import BrushImpl from './components/BrushImpl';
import { setSelectedTime, setSelectedTimeline } from '../../actions/timelineActions';
import './Timeline.css';

const styles = {
  dateSelectedTextField: {
    width: '100%',
    'font-size': '0.8em',
  },
  gridContainer: {
    padding: '10px 2px',
    width: '100%',
    margin: '0px',
  },
  timelineChartWrapper: {
    height: 'calc(15vh - 18px)',
    overflow: 'hidden',
  },
  calendartWrapper: {
    height: 'calc(15vh - 18px)',
    overflow: 'hidden',
    padding: '8px',
  },
};

class Timeline extends Component {
  static propTypes = {
    setSelectedTime: PropTypes.func.isRequired,
    setSelectedTimeline: PropTypes.func.isRequired,
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
      calendartWrapper: PropTypes.string,
    }).isRequired,
  }

  constructor() {
    super();
    this.state = {
      setStart: true,
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
    this.props.setSelectedTimeline();
    document.getElementById('timeline-chart').addEventListener('mousedown', () => {
      this.setState({ currentlySelecting: true });
      this.setState({ selectedStartX: this.state.mouseMovePosition });
      this.setState({ previewStartX: this.state.mouseMovePosition });

      document.getElementById('start_date').value = this.state.selectedStartX;
      document.getElementById('end_date').value = this.state.selectedStartX;
      // Clear  the Other end to start a new selection TODO
      this.setState({ selectedEndX: 0 });
      this.setState({ previewEndX: 0 });
    }, false);

    document.getElementById('timeline-chart').addEventListener('mouseup', () => {
      this.setState({ currentlySelecting: false });
      this.setState({ selectedEndX: this.state.mouseMovePosition });
      this.setState({ previewEndX: this.state.mouseMovePosition });
      if (this.state.selectedEndX > this.state.selectedStartX) {
        document.getElementById('end_date').value = this.state.selectedEndX;
      } else {
        document.getElementById('start_date').value = this.state.selectedEndX;
      }
    }, false);

    document.getElementById('timeline-chart').addEventListener('mousemove', () => {
      if (this.state.currentlySelecting) {
        if (this.state.previewEndX !== this.state.mouseMovePosition) {
          this.setState({ previewEndX: this.state.mouseMovePosition });
        }
        if (this.state.previewEndX > this.state.selectedStartX) {
          document.getElementById('end_date').value = this.state.previewEndX;
        } else if (this.state.previewEndX === this.state.selectedStartX) {
          document.getElementById('end_date').value = this.state.previewEndX;
          document.getElementById('start_date').value = this.state.previewEndX;
        } else {
          document.getElementById('start_date').value = this.state.previewEndX;
        }
      }
    }, true);
  }

  getmouseZoomLocation = () => this.state.mouseZoomLocation;

  updateSelectedDate = () => {
    const startDate = document.getElementById('start_date').value;
    const endDate = document.getElementById('end_date').value;
    this.props.setSelectedTime({
      startDate,
      endDate,
    });
  };

  formatDateTicks = (date) => {
    const year = date.substring(0, 4);
    const month = date.substring(4, 6);
    const day = date.substring(6, 8);
    return `${month}/${day}/${year}`;
  }

  recordMouseMove = (e) => {
    if (e && e.activeLabel) {
      if (this.state.mouseMovePosition !== e.activeLabel) {
        this.setState({ mouseMovePosition: e.activeLabel, mouseZoomLocation: e.chartX });
      }
    }
  }

  data = () => this.props.entireTimelineData;
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
        data={this.data()}
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
          tickFormatter={this.formatDateTicks}
          minTickGap={15}
        />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          offset={50}
          animationDuration={0}
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
          startIndex={this.data().length - 30}
          endIndex={this.data().length - 1}
          getmouseZoomLocation={this.getmouseZoomLocation}
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
    <div id="timeline-selector">
      <Grid container spacing={8} className={this.props.classes.gridContainer} >
        <Grid item sm={3} md={2}>
          <Paper elevation={4} className={this.props.classes.calendartWrapper} >
            <Button raised className="cal-button" color="primary" onClick={this.updateSelectedDate} >Set Date!</Button>
            <Button raised className="cal-button" onClick={this.props.setSelectedTimeline} >Set Timeline!</Button>
            <FormGroup style={{ display: 'none' }}>
              <InputGroup>
                <FormControl type="text" placeholder="Start Date" id="start_date" defaultValue="20160329" />
                <InputGroup.Addon>To</InputGroup.Addon>
                <FormControl type="text" placeholder="End Date" id="end_date" defaultValue="20160512" />
              </InputGroup>
            </FormGroup>
            <TextField className={this.props.classes.dateSelectedTextField} label="Selected Date Range" defaultValue="asd" id="dateRangePicker" />
          </Paper>
        </Grid>
        <Grid item sm={9} md={10}>
          <Paper elevation={4} className={this.props.classes.timelineChartWrapper} >
            <div id="timeline-chart">
              {(this.data().length > 1) ? this.renderTimeline() : this.renderLoading()}
            </div>
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

const mapStateToProps = state => ({
  entireTimelineData: state.timeline.entireTimelineData,
});

export default connect(
  mapStateToProps,
  { setSelectedTime, setSelectedTimeline },
)(withStyles(styles)(Timeline));
