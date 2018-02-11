import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Button from 'material-ui/Button';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Divider from 'material-ui/Divider';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Typography from 'material-ui/Typography';
import _ from 'lodash';
import { moveReport, getCaseReports } from '../../../actions/reportActions';
import CaseIcon from './CaseIcon';
import TrashIcon from './TrashIcon';
import AllReportsIcon from './AllReportsIcon';
import styles from './CaseSummaryListingStyles';

/**
 * This is the component for the Case Summary Listing Planel
 */
class CaseSummaryListing extends React.PureComponent {
  static propTypes = {
    bins: PropTypes.arrayOf(PropTypes.string).isRequired,
    classes: PropTypes.shape({
      summaryContainer: PropTypes.string,
      expansionPanelSummary: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  /**
   * Checks if the selected bin in the ReportList component changes and retrieves
   * new summary if necessary
   */
  componentDidUpdate(prevProps) {
    // if (prevProps.bin !== this.props.bin || !_.isEqual(this.props.filters, prevProps.filters)) {
    //   this.props.getCaseReports(this.props.filters, this.props.bin, this.props.userID)
    //     .then((bins) => {
    //       this.setState({ data: bins });
    //       this.changeExpandedDetails([]);
    //     });
    // }
  }

  renderListItem = (binName) => {
    switch (binName) {
      case 'Trash':
      case 'All Reports':
        return null;
      default:
        return (
          <div key={binName} >
            <ExpansionPanel style={{ margin: '5px 2px' }}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                classes={{ content: this.props.classes.expansionPanelSummary }}
              >
                <CaseIcon
                  width={30}
                  height={30}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    }}
                />
                <Typography type="button" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {binName}
                </Typography>
              </ExpansionPanelSummary>
              <Divider light />
              <ExpansionPanelDetails>
                <Typography>
                  Put Summary here!
                </Typography>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          </div>
        );
    }
  }


  render() {
    return (
      <Paper id="summary-container" className={this.props.classes.summaryContainer} elevation={4}>
        <Typography type="title" style={{ padding: '20px' }}>
          View Case Summary:
        </Typography>
        {this.props.bins.map(binName => (
          this.renderListItem(binName)
          ))}
      </Paper>
    );
  }
}


const mapStateToProps = state => ({
  filters: state.filters,
  userID: state.user.userID,
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  { moveReport, getCaseReports },
)(withStyles(styles)(CaseSummaryListing));
