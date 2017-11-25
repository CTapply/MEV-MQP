import { Brush } from 'recharts';
import PropTypes from 'prop-types';
import { scalePoint } from 'd3-scale';
import _ from 'lodash';

/**
 * This is the wrapper component of the Recharts Brush to add our own custom functionality
 */
class BrushImpl extends Brush {
  static propTypes = {
    getUnformattedDateFromFormattedRange: PropTypes.func.isRequired,
  }

  /**
   * When you scroll on the timeline WITHOUT the control key held
   * This function will scroll in the timeline in either direction.
   */
  scrollHandler = (e) => {
    e.preventDefault();
    const { startX, endX } = this.state;
    const { x, width, travellerWidth, onChange } = this.props;
    let delta = 0;

    if (e.deltaY > 0) {
      delta = 1;
    } else if (e.deltaY < 0) {
      if (this.state.startX > 0) {
        delta = -1;
      }
    } else {
      console.log('DeltaY is 0');
    }

    if (delta > 0) {
      delta = Math.min(
        delta,
        (x + width) - travellerWidth - endX,
        (x + width) - travellerWidth - startX,
      );
    } else if (delta < 0) {
      delta = Math.max(delta, x - startX, x - endX);
    }

    const newIndex = this.getIndex({
      startX: startX + delta,
      endX: endX + delta,
    });

    this.setState({
      startX: startX + delta,
      endX: endX + delta,
      slideMoveStartX: e.pageX,
    }, () => {
      if (onChange) {
        onChange(newIndex);
      }
    });
  }

  /**
   * When you scroll on the timeline with the control key held
   * This function will zoom in the timeline based on mouse postion in the chart.
   */
  zoomHandler = (e) => {
    e.preventDefault();
    if (this.state.endX - this.state.startX < 2 && e.deltaY > 0) {
      return null;
    }

    let movingTravellerId;
    const params = { startX: this.state.startX, endX: this.state.endX };
    let delta = 0;

    if (Math.random() > this.props.getmouseZoomLocation() / (this.props.width * 1.05)) {
      movingTravellerId = 'endX';
    } else {
      movingTravellerId = 'startX';
    }

    if (e.deltaY > 0) {
      if (movingTravellerId === 'endX') {
        delta = -1;
      } else {
        delta = 1;
      }
    } else if (e.deltaY < 0) {
      if (this.state.startX > 0) {
        if (movingTravellerId === 'endX') {
          delta = 1;
        } else {
          delta = -1;
        }
      }
    } else {
      console.log('DeltaY is 0');
    }

    const prevValue = this.state[movingTravellerId];

    params[movingTravellerId] = prevValue + delta;
    const newIndex = this.getIndex(params);

    this.setState({
      [movingTravellerId]: prevValue + delta,
      brushMoveStartX: e.pageX,
    }, () => {
      if (this.props.onChange) {
        this.props.onChange(newIndex);
      }
    });

    return null;
  }

  componentDidMount() {
    document.getElementById('timeline-chart').addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        this.zoomHandler(e);
      } else {
        this.scrollHandler(e);
      }
    }, true);

    document.getElementById('setDateBtn').addEventListener('click', () => {
      const dateRange = document.getElementById('dateRangePicker').value;
      const dates = this.props.getUnformattedDateFromFormattedRange(dateRange);

      const { data, x, width, travellerWidth } = this.props;
      const len = data.length;

      this.scale = scalePoint()
        .domain(_.range(0, len))
        .range([x, (x + width) - travellerWidth]);
      this.scaleValues = this.scale.domain().map(entry => this.scale(entry));

      const brushStartIndex = Number(_.findKey(data, { init_fda_dt: dates.startDate }));
      let brushEndIndex = Number(_.findKey(data, { init_fda_dt: dates.endDate }));

      if (brushStartIndex === brushEndIndex) brushEndIndex += 1;

      const newIndex = this.getIndex({
        startX: this.scale(brushStartIndex),
        endX: this.scale(brushEndIndex),
      });

      this.setState({
        startX: this.scale(brushStartIndex),
        endX: this.scale(brushEndIndex),
      }, () => {
        if (this.props.onChange) {
          this.props.onChange(newIndex);
        }
      });
    });
  }
}

export default BrushImpl;
