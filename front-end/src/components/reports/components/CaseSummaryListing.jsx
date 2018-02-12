import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails,
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Typography from 'material-ui/Typography';
import CaseSummary from '../../cases/CaseSummary';
import { moveReport, getCaseReports } from '../../../actions/reportActions';
import CaseIcon from '../../../resources/CaseIcon';
import styles from './CaseSummaryListingStyles';

/**
 * This is the component for the Case Summary Listing Planel
 */
class CaseSummaryListing extends React.PureComponent {
  static propTypes = {
    bins: PropTypes.arrayOf(PropTypes.object).isRequired,
    userID: PropTypes.number.isRequired,
    classes: PropTypes.shape({
      summaryContainer: PropTypes.string,
      expansionPanelSummary: PropTypes.string,
    }).isRequired,
  }

  renderListItem = (bin) => {
    switch (bin.name) {
      case 'Trash':
      case 'All Reports':
        return null;
      default:
        return (
          <div key={bin.case_id} >
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
                  {bin.name}
                </Typography>
              </ExpansionPanelSummary>
              <Divider light />
              <ExpansionPanelDetails>
                <CaseSummary caseID={bin.case_id} userID={this.props.userID} />
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
        {this.props.bins.map(bin => (
          this.renderListItem(bin)
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
