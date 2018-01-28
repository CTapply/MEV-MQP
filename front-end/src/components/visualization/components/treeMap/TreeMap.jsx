import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Treemap, Tooltip } from 'recharts';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { toggleMETypeFilter, toggleProductFilter, toggleStageFilter, toggleCauseFilter } from '../../../../actions/visualizationActions';
import ClearFilterIcon from '../../../../resources/clearFilterIcon.svg';
import CustomizedContent from './components/CustomizedContent';
import styles from './TreeMapStyles';
import CustomTooltip from './components/CustomTooltip';

/**
 * This is the component for the TreeMap visualization
 */
class TreeMap extends Component {
  static propTypes = {
    toggleMETypeFilter: PropTypes.func.isRequired,
    toggleProductFilter: PropTypes.func.isRequired,
    toggleStageFilter: PropTypes.func.isRequired,
    toggleCauseFilter: PropTypes.func.isRequired,
    mainVisHeight: PropTypes.string.isRequired,
    classes: PropTypes.shape({
      mainVisualization: PropTypes.string,
      treemapVisualization: PropTypes.string,
      treePaper: PropTypes.string,
      clearFilterChip: PropTypes.string,
      chipAvatar: PropTypes.string,
    }).isRequired,
  }
  constructor(props) {
    super(props);
    this.state = {
      mainWidth: 1,
      treeMapHeight: 155,
      stillResizingTimer: '',
    };
  }

  componentDidMount() {
    // Once the screen has loaded, optimize the size of the TreeMap
    this.resizeGraph();

    // Listen for window resize, but wait till they have stopped to do the size calculations.
    window.addEventListener('resize', this.resizeTimer);

    // Resize the treemaps when the main-visualization size is changed
    document.getElementById('main-visualization').addEventListener('transitionend', this.resizeGraph);
  }

  componentWillUnmount() {
    // Remove the event listeners when unmounting
    window.removeEventListener('resize', this.resizeTimer);
    document.getElementById('main-visualization').removeEventListener('transitionend', this.resizeGraph);
  }

  /**
   * Generates a random integer between the two given values
   * @param {int} min
   * @param {int} max
   * @return {int} Random int between the Min and Max
   */
  getRandomInt = (min, max) =>
    (Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min));

  getMaxSerious = (type) => {
    if (this.props[type]) {
      return this.props[type].reduce((maxSerious, category) => {
        const numSerious = category.size - category.UNK;
        return (numSerious > maxSerious) ? numSerious : maxSerious;
      }, 1);
    }
    return 1;
  }

  /**
   * After 250ms of not resizing, we will then resize the graph (this improves performance)
   */
  resizeTimer = () => {
    clearTimeout(this.state.stillResizingTimer);
    this.setState({ stillResizingTimer: setTimeout(this.resizeGraph, 250) });
  }

  /**
   * Toggles the filter in Redux State for the bar clicked on in the chart
   */
  clearFilter = type => (e) => {
    switch (type) {
      case 'meType':
        this.props.toggleMETypeFilter('CLEAR');
        break;
      case 'product':
        this.props.toggleProductFilter('CLEAR');
        break;
      case 'stage':
        this.props.toggleStageFilter('CLEAR');
        break;
      case 'cause':
        this.props.toggleCauseFilter('CLEAR');
        break;
      default:
    }
  }

  /**
   * Toggles the filter in Redux State for the bar clicked on in the chart
   */
  handleFilterClickToggle = type => (e) => {
    if (e && e.name) {
      switch (type) {
        case 'meType':
          this.props.toggleMETypeFilter(e.name);
          break;
        case 'product':
          this.props.toggleProductFilter(e.name);
          break;
        case 'stage':
          this.props.toggleStageFilter(e.name);
          break;
        case 'cause':
          this.props.toggleCauseFilter(e.name);
          break;
        default:
      }
    }
  }

  /**
   * Calculates the best size for the visualization for better scalability
   */
  resizeGraph = () => {
    const firstTreeMap = document.getElementById('firstTreeMap');
    const firstTreeMapHeight = window.getComputedStyle(firstTreeMap, null).getPropertyValue('height');
    this.setState({
      treeMapHeight: parseInt(firstTreeMapHeight, 10) - 10,
      mainWidth: document.getElementById('main-visualization').getBoundingClientRect().width - 20,
    });
  }

  render = () => (
    <div
      id="main-visualization"
      className={this.props.classes.mainVisualization}
      style={{ height: this.props.mainVisHeight }}
    >
      <div className={this.props.classes.treemapVisualization} id="firstTreeMap">
        <Chip
          avatar={<Avatar src={ClearFilterIcon} alt="Clear Filters" className={this.props.classes.chipAvatar} />}
          label="Clear Filter"
          onClick={this.clearFilter('meType')}
          className={this.props.classes.clearFilterChip}
        />
        <div className={this.props.classes.treePaper}>
          <Paper elevation={16}>
            <Treemap
              width={this.state.mainWidth}
              height={this.state.treeMapHeight}
              data={this.props.meType}
              dataKey="size"
              ratio={4 / 3}
              stroke="#ddd"
              fill="url(#colorSevere)"
              onClick={this.handleFilterClickToggle('meType')}
              content={<CustomizedContent highestSeriousCount={this.getMaxSerious('meType')} treeMap="meType" />}
              isAnimationActive={false}
              animationDuration={0}
            >
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#424242', strokeWidth: 1 }}
                wrapperStyle={{ padding: '4px', zIndex: 1000 }}
              />
            </Treemap>
          </Paper>
        </div>
      </div>
      <div className={this.props.classes.treemapVisualization}>
        <Chip
          avatar={<Avatar src={ClearFilterIcon} alt="Clear Filters" className={this.props.classes.chipAvatar} />}
          label="Clear Filter"
          onClick={this.clearFilter('product')}
          className={this.props.classes.clearFilterChip}
        />
        <div className={this.props.classes.treePaper}>
          <Paper elevation={16}>
            <Treemap
              width={this.state.mainWidth}
              height={this.state.treeMapHeight}
              data={this.props.product}
              dataKey="size"
              ratio={4 / 3}
              stroke="#ddd"
              fill="url(#colorSevere)"
              onClick={this.handleFilterClickToggle('product')}
              content={<CustomizedContent highestSeriousCount={this.getMaxSerious('product')} treeMap="product" />}
              isAnimationActive={false}
              animationDuration={0}
            >
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#424242', strokeWidth: 1 }}
                wrapperStyle={{ padding: '4px', zIndex: 1000 }}
              />
            </Treemap>
          </Paper>
        </div>
      </div>
      <div className={this.props.classes.treemapVisualization}>
        <Chip
          avatar={<Avatar src={ClearFilterIcon} alt="Clear Filters" className={this.props.classes.chipAvatar} />}
          label="Clear Filter"
          onClick={this.clearFilter('stage')}
          className={this.props.classes.clearFilterChip}
        />
        <div className={this.props.classes.treePaper}>
          <Paper elevation={16}>
            <Treemap
              width={this.state.mainWidth}
              height={this.state.treeMapHeight}
              data={this.props.stage}
              dataKey="size"
              ratio={4 / 3}
              stroke="#ddd"
              fill="url(#colorSevere)"
              onClick={this.handleFilterClickToggle('stage')}
              content={<CustomizedContent highestSeriousCount={this.getMaxSerious('stage')} treeMap="stage" />}
              isAnimationActive={false}
              animationDuration={0}
            >
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#424242', strokeWidth: 1 }}
                wrapperStyle={{ padding: '4px', zIndex: 1000 }}
              />
            </Treemap>
          </Paper>
        </div>
      </div>
      <div className={this.props.classes.treemapVisualization}>
        <Chip
          avatar={<Avatar src={ClearFilterIcon} alt="Clear Filters" className={this.props.classes.chipAvatar} />}
          label="Clear Filter"
          onClick={this.clearFilter('cause')}
          className={this.props.classes.clearFilterChip}
        />
        <div className={this.props.classes.treePaper}>
          <Paper elevation={16}>
            <Treemap
              width={this.state.mainWidth}
              height={this.state.treeMapHeight}
              data={this.props.cause}
              dataKey="size"
              ratio={4 / 3}
              stroke="#ddd"
              fill="url(#colorSevere)"
              onClick={this.handleFilterClickToggle('cause')}
              content={<CustomizedContent highestSeriousCount={this.getMaxSerious('cause')} treeMap="cause" />}
              isAnimationActive={false}
              animationDuration={0}
            >
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: '#424242', strokeWidth: 1 }}
                wrapperStyle={{ padding: '4px', zIndex: 1000 }}
              />
            </Treemap>
          </Paper>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  meType: state.mainVisualization.meType,
  product: state.mainVisualization.product,
  stage: state.mainVisualization.stage,
  cause: state.mainVisualization.cause,
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  { toggleMETypeFilter, toggleProductFilter, toggleStageFilter, toggleCauseFilter },
)(withStyles(styles)(TreeMap));
