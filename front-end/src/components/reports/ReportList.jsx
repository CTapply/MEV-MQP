import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import Modal from 'material-ui/Modal';
import Tabs, { Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
import MaterialTooltip from 'material-ui/Tooltip';
import Paper from 'material-ui/Paper';
import ReportTable from './components/ReportTable';
import CaseSummaryListing from './components/CaseSummaryListing';
import MEVColors from '../../theme';
import { getUserCases, createUserBin } from '../../actions/reportActions';
import CaseIcon from '../../resources/CaseIcon';
import NewCaseIcon from '../../resources/NewCaseIcon';
import TrashIcon from '../../resources/TrashIcon';
import AllReportsIcon from '../../resources/AllReportsIcon';
import GoToVisualizationIcon from '../../resources/goToVisualizationIcon.svg';
import ViewCaseSummary from '../../resources/caseSummary.svg';
import styles from './ReportListStyles';


const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      ...blue,
      500: MEVColors.buttonLight,
      700: MEVColors.buttonHover,
    },
    secondary: {
      ...green,
    },
    ...MEVColors,
    error: red,
  },
});

/**
 * This is the component for the Report page
 */
class ReportList extends Component {
  static propTypes = {
    getUserCases: PropTypes.func.isRequired,
    createUserBin: PropTypes.func.isRequired,
    userID: PropTypes.number.isRequired,
    classes: PropTypes.shape({
      newCaseArea: PropTypes.string,
      goToVisualizationSVG: PropTypes.string,
      caseSummarySVG: PropTypes.string,
      tooltipStyle: PropTypes.string,
      ReportList: PropTypes.string,
      newCaseModal: PropTypes.string,
      closedSummaryTableContainer: PropTypes.string,
      closedSummaryContainer: PropTypes.string,
      openSummaryTableContainer: PropTypes.string,
      openSummaryContainer: PropTypes.string,
    }).isRequired,
  }

  constructor() {
    super();
    this.state = {
      bin: 'all reports',
      userBins: [],
      newCaseModalOpen: false,
      snackbarOpen: false,
      snackbarMessage: '',
      currentTab: 0,
      summaryOpen: false,
    };
  }

  componentWillMount() {
    this.getBins();
  }

  /**
   * Retrieves the names of the bins the user has created
   */
  getBins = () => {
    this.props.getUserCases(this.props.userID)
      .then((bins) => {
        if (bins) {
          this.setState({
            userBins: [{ name: 'All Reports', case_id: -1 }].concat(
              bins.filter(bin => bin.active)
                .map(bin => ({ name: this.toTitleCase(bin.name), case_id: bin.case_id }))
            ),
          });
        }
      });
  }

  /**
   * Changes the first letter of any word in a string to be capital
   */
  toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  /**
   * Handler for Tab bar clicks
   */
  handleTabClick = (event, currentTab) => {
    // If the Current tab is the New Case tab, open the Modal
    if (currentTab === 2) {
      this.setState({
        currentTab,
        newCaseModalOpen: true,
      });
    } else {
      this.setState({
        currentTab,
        bin: event.currentTarget.getAttribute('name').toLowerCase(),
      });
    }
  };

  /**
   * Handler to close the SnackBar
   */
  handleCloseSnackbar = () => {
    this.setState({ snackbarOpen: false });
  };

  /**
   * Handler for Opening the New Case Modal
   */
  handleNewCaseOpen = () => {
    this.setState({ newCaseModalOpen: true });
  };

  /**
   * Handler for Opening the New Case Modal
   */
  handleViewCaseSummary = () => {
    this.setState({ summaryOpen: !this.state.summaryOpen });
  };

  /**
   * Handler for Closing the New Case Modal
   */
  handleNewCaseClose = () => {
    this.setState({
      newCaseModalOpen: false,
      // Set back to the All Reports Tab
      currentTab: 0,
      bin: 'all reports',
    });
  };

  /**
   * Checks name validity of new bin and shows an error or sends a backend fetch request
   */
  handleNewCaseClick = () => {
    const binName = document.getElementById('newCaseName').value.toLowerCase().trim();
    const binDesc = document.getElementById('newCaseDesc').value.trim();
    if (binName !== '' && !this.state.userBins.filter(bin => bin.name.toLowerCase()).includes(binName).length) {
      this.props.createUserBin(this.props.userID, binName, binDesc)
        .then((newCaseID) => {
          this.setState({
            snackbarOpen: true,
            snackbarMessage: `Case ${this.toTitleCase(binName)} Created!`,
            userBins: this.state.userBins.concat({
              name: this.toTitleCase(binName), case_id: newCaseID,
            }),
          });
          document.getElementById('newCaseName').value = '';
          document.getElementById('newCaseDesc').value = '';
          this.handleNewCaseClose();
        });
    } else {
      this.setState({ snackbarOpen: true, snackbarMessage: 'Invalid Case Name' });
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className={this.props.classes.ReportList} >
          {/* ====== Top Bar with Tabs for each Case ====== */}
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.currentTab}
              onChange={this.handleTabClick}
              indicatorColor="primary"
              textColor="primary"
              scrollable
              scrollButtons="auto"
              centered
            >
              <Tab icon={<AllReportsIcon />} label="All Reports" key="All Reports" name="All Reports" />
              <Tab icon={<TrashIcon />} label="Trash" key="Trash" name="Trash" />
              <Tab icon={<NewCaseIcon />} label="New Case" name="New Case" />
              {this.state.userBins.map((bin) => {
                switch (bin.name) {
                  case 'Trash':
                  case 'All Reports':
                  return null;
                  default:
                    return (
                      <Tab icon={<CaseIcon />} label={bin.name} key={bin.case_id} name={bin.name} />
                    );
                }
              })}
            </Tabs>
          </AppBar>

          {/* ====== Table for Viewing the Reports ====== */}
          <div className={(this.state.summaryOpen) ? this.props.classes.openSummaryTableContainer : this.props.classes.closedSummaryTableContainer} >
            <ReportTable
              bin={this.state.bin}
              bins={this.state.userBins}
              summaryOpen={this.state.summaryOpen}
              toTitleCase={this.toTitleCase}
              tableClass={this.state.summaryOpen}
            />
          </div>

          {/* ====== SideBar for Viewing the Case Summary ====== */}
          <div id="summary-sidebar" className={(this.state.summaryOpen) ? this.props.classes.openSummaryContainer : this.props.classes.closedSummaryContainer} >
            <CaseSummaryListing
              bins={this.state.userBins}
              userID={this.props.userID}
              summaryOpen={this.state.summaryOpen}
            />
          </div>

          {/* ====== Modal for Creating a New Case ====== */}
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.newCaseModalOpen}
            onClose={this.handleNewCaseClose}
          >
            <Paper elevation={8} className={this.props.classes.newCaseModal} >
              <Typography type="title" id="modal-title">
                Create a Case
              </Typography>
              <hr />
              <TextField
                label="Case Name"
                placeholder="Advil"
                id="newCaseName"
                style={{ margin: 12, width: '100%' }}
              />
              <TextField
                multiline
                rowsMax="4"
                label="Case Description"
                placeholder="This case contains reports about Advil"
                id="newCaseDesc"
                style={{ margin: 12, width: '100%' }}
              />
              <hr />
              <Button raised onClick={this.handleNewCaseClick} style={{ margin: 12 }} color="primary">Create Case</Button>
            </Paper>
          </Modal>

          {/* ====== Floating Action Button for Going back to Main Visualization ====== */}
          <div style={{ position: 'absolute', left: '20px', bottom: '20px' }} >
            <MaterialTooltip
              title="Go Back To Visualization"
              placement="top"
              enterDelay={50}
              classes={{
                tooltip: this.props.classes.tooltipStyle,
                popper: this.props.classes.tooltipStyle,
                }}
            >
              <Link href="/" to="/" >
                <Button fab style={{ margin: 12 }} color="primary">
                  <img src={GoToVisualizationIcon} className={this.props.classes.goToVisualizationSVG} alt="Go Back To Visualization" />
                </Button>
              </Link>
            </MaterialTooltip>
          </div>

          {/* ====== Floating Action Button for Opening Case Summary ====== */}
          <div style={{ position: 'absolute', right: '20px', bottom: '20px' }} >
            <MaterialTooltip
              title="Open Case Summary"
              placement="top"
              enterDelay={50}
              classes={{
                tooltip: this.props.classes.tooltipStyle,
                popper: this.props.classes.tooltipStyle,
                }}
            >
              <Button fab style={{ margin: 12 }} color="primary" onClick={this.handleViewCaseSummary} >
                <img src={ViewCaseSummary} className={this.props.classes.caseSummarySVG} alt="Open Case Summary" />
              </Button>
            </MaterialTooltip>
          </div>

          {/* ====== Snackbar for Notificaitons to the User ====== */}
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.snackbarOpen}
            onClose={this.handleCloseSnackbar}
            transitionDuration={1000}
            SnackbarContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.snackbarMessage}</span>}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
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
  { getUserCases, createUserBin },
)(withStyles(styles)(ReportList));
