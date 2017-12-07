import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Chip from 'material-ui/Chip';
import Avatar from 'material-ui/Avatar';
import { toggleSexFilter, toggleAgeFilter, toggleLocationFilter, toggleOccupationFilter } from '../../actions/demographicActions';
import { toggleMETypeFilter, toggleProductFilter, toggleStageFilter, toggleCauseFilter } from '../../actions/visualizationActions';
import ClearFilterIcon from '../../resources/clearFilterIcon.svg';


const styles = {
  filterPaper: {
    padding: '0px',
    display: 'inline-block',
    width: '100%',
    height: '100%',
    margin: '4px',
    transform: 'translateY(4px)',
  },
  clearFilterChip: {
    'font-size': '9pt',
    height: '14pt',
    position: 'absolute',
  },
  chipAvatar: {
    height: '13pt',
    width: '13pt',
    transform: 'translateX(1px)',
    'box-shadow': '0px 1px 2px 1px rgba(0,0,0,0.3)',
  },
  chipLabel: {
    paddingLeft: '6px',
    paddingRight: '0px',
  },
  toolTipStyle: {
    'font-size': '10pt',
    padding: '5px',
    'background-color': 'rgba(75,75,75,0.85)',
    overflow: 'hidden',
    color: 'rgba(255,255,255,1)',
    'text-overflow': 'ellipsis',
    '-webkit-box-shadow': '2px 5px 5px 0 rgba(0,0,0,0.3)',
    'box-shadow': '2px 5px 5px 0 rgba(0,0,0,0.3)',
    'text-shadow': '1px 1px 1px rgba(0,0,0,0.2)',
    'z-index': '10000',
    position: 'absolute',
    display: 'block',
  },
  toolTipParagraph: {
    margin: '0px',
    color: 'rgba(255,255,255,1)',
  },
};

/**
 * This is the container component for the Currently Selected Filters
 */
class CurrentlySelectedFilters extends Component {
  static propTypes = {
    toggleSexFilter: PropTypes.func.isRequired,
    toggleAgeFilter: PropTypes.func.isRequired,
    toggleLocationFilter: PropTypes.func.isRequired,
    toggleOccupationFilter: PropTypes.func.isRequired,
    toggleMETypeFilter: PropTypes.func.isRequired,
    toggleProductFilter: PropTypes.func.isRequired,
    toggleStageFilter: PropTypes.func.isRequired,
    toggleCauseFilter: PropTypes.func.isRequired,
    filters: PropTypes.shape({
      init_fda_dt: PropTypes.object,
      sex: PropTypes.array,
      occr_country: PropTypes.array,
      age: PropTypes.array,
      occp_cod: PropTypes.array,
      meType: PropTypes.array,
      product: PropTypes.array,
      stage: PropTypes.array,
      cause: PropTypes.array,
    }).isRequired,
    classes: PropTypes.shape({
      filterPaper: PropTypes.string,
      clearFilterChip: PropTypes.string,
      chipAvatar: PropTypes.string,
      chipLabel: PropTypes.string,
      toolTipStyle: PropTypes.string,
      toolTipParagraph: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      mouseOverKey: '',
      mouseX: 0,
      mouseY: 0,
    };
  }

  componentDidMount() {
    document.getElementById('selected-filters-box').addEventListener('mousemove', (e) => {
      if (e.target.closest(`.${this.props.classes.filterPaper}`) && e.target.closest(`.${this.props.classes.filterPaper}`).getAttribute('name')) {
        this.setState({
          mouseOverKey: e.target.closest(`.${this.props.classes.filterPaper}`).getAttribute('name'),
          mouseX: e.screenX,
          mouseY: e.screenY,
        });
      } else {
        this.setState({
          mouseOverKey: '',
        });
      }
    }, true);

    document.getElementById('selected-filters-box').addEventListener('mouseleave', (e) => {
      this.setState({
        mouseOverKey: '',
      });
    }, false);
  }

  componentWillUnmount() {

  }

  filterTitles = {
    init_fda_dt: 'Date',
    sex: 'Sex',
    age: 'Age',
    occr_country: 'Location',
    occp_cod: 'Occupation',
    meType: 'ME-Type',
    product: 'Product',
    stage: 'Stage',
    cause: 'Cause',
  }

  /**
   * Toggles the filter in Redux State for the bar clicked on in the chart
   */
  handleFilterClickToggle = type => () => {
    switch (type) {
      case 'sex':
        this.props.toggleSexFilter('CLEAR');
        break;
      case 'age':
        this.props.toggleAgeFilter('CLEAR');
        break;
      case 'occr_country':
        this.props.toggleLocationFilter('CLEAR');
        break;
      case 'occp_cod':
        this.props.toggleOccupationFilter('CLEAR');
        break;
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

  renderTooltip = () => {
    return (this.state.mouseOverKey !== '')
      ? (
        <div id={'SelectedFilter-Tooltip'} className={this.props.classes.toolTipStyle} style={{ left: `${this.state.mouseX - 120}px`, top: `${this.state.mouseY - 115}px` }} >
          {(this.state.mouseOverKey !== 'init_fda_dt')
            ? (
              <div>
                <p className={this.props.classes.toolTipParagraph}>
                  <b>{this.filterTitles[this.state.mouseOverKey]}</b>
                </p>
                <p className={this.props.classes.toolTipParagraph} >
                  {this.props.filters[this.state.mouseOverKey].join(', ')}
                </p>
              </div>
            )
            : (
              <div>
                <Typography type="subheading" className={this.props.classes.toolTipParagraph}>
                  <b>{this.filterTitles[this.state.mouseOverKey]}</b>
                </Typography>
                <Typography type="subheading" className={this.props.classes.toolTipParagraph} >
                  Start Date: {this.props.filters[this.state.mouseOverKey].start}
                </Typography>
                <Typography type="subheading" className={this.props.classes.toolTipParagraph} >
                  End Date: {this.props.filters[this.state.mouseOverKey].end}
                </Typography>
              </div>
            )
          }
        </div>
      )
      : null;
  }

  renderFilterBox = () => Object.keys(this.props.filters).map(key =>
    ((this.props.filters[key].length !== 0)
      ? (
        <Paper className={this.props.classes.filterPaper} style={{ width: '100px' }} elevation={4} key={key} name={key} >
          {(key !== 'init_fda_dt')
            ? (
              <Chip
                avatar={<Avatar src={ClearFilterIcon} alt="Clear Filters" className={this.props.classes.chipAvatar} />}
                onClick={this.handleFilterClickToggle(key)}
                className={this.props.classes.clearFilterChip}
                style={{ transform: `translateY(-5px) translateX(${100 - 13}px)` }}
                classes={{ label: this.props.classes.chipLabel }}
              />
            )
            : null
          }
          <Typography type="subheading" align="center" style={{ lineHeight: '2.3rem' }} >
            {this.filterTitles[key]}
          </Typography>
        </Paper>
      )
      : null));

  render() {
    return (
      <div id="selected-filters-box" >
        {this.renderFilterBox()}
        {this.renderTooltip()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  filters: {
    init_fda_dt: state.filters.init_fda_dt,
    sex: state.filters.sex,
    occr_country: state.filters.occr_country,
    age: state.filters.age,
    occp_cod: state.filters.occp_cod,
    meType: state.filters.meType,
    product: state.filters.product,
    stage: state.filters.stage,
    cause: state.filters.cause,
  },
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  {
    toggleSexFilter,
    toggleAgeFilter,
    toggleLocationFilter,
    toggleOccupationFilter,
    toggleMETypeFilter,
    toggleProductFilter,
    toggleStageFilter,
    toggleCauseFilter,
  },
)(withStyles(styles)(CurrentlySelectedFilters));
