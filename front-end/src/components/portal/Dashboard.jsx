import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import Paper from 'material-ui/Paper';
import MaterialTooltip from 'material-ui/Tooltip';
import Button from 'material-ui/Button';
import AppBar from 'material-ui/AppBar';
import Switch from 'material-ui/Switch';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import GoToVisualizationIcon from '../../resources/goToVisualizationIcon.svg';
import GoToReportsIcon from '../../resources/goToReportsIcon.svg';
import MEVColors from '../../theme';
import placeholderUserImage from './images/user_img.png';
import UserReportTable from './userComponents/UserReportTable';
import { getUserCases, archiveCase } from '../../actions/reportActions';
import { getUserInactiveCasesCount, getUserActiveCasesCount } from '../../actions/userActions';
import styles from './DashboardStyles';

function TabContainer(props) {
  return (
    <Typography
      component="div"
      style={{
      padding: '15px',
      boxShadow: '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
      border: '3px solid ##f5f5f5',
  }}
    >
      {props.children}
    </Typography>
  );
}
TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

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
 * This is the component for the Dashboard
 */
class Dashboard extends Component {
  static propTypes = {
    getUserCases: PropTypes.func.isRequired,
    archiveCase: PropTypes.func.isRequired,
    getUserInactiveCasesCount: PropTypes.func.isRequired,
    getUserActiveCasesCount: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    userID: PropTypes.number.isRequired,
    classes: PropTypes.shape({
      paper: PropTypes.string,
      root: PropTypes.string,
      paperNoPadding: PropTypes.string,
      clearfix: PropTypes.string,
      userimage: PropTypes.string,
      reportsWrapper: PropTypes.string,
      tooltipStyle: PropTypes.string,
    }).isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      userBins: [],
      binDescs: {},
      value: 0,
      case: '',
      binActives: {},
      activeBinNumbers: 0,
      inactiveBinNumbers: 0,
    };
  }

  componentWillMount() {
    if (!this.props.isLoggedIn) {
      window.location = '/';
    }
    this.getBins();
    this.getActiveCases();
    this.getInactiveCases();
  }

  /**
   * Retrieves the names of the bins the user has created
   * ALSO ALPHABETIZES THE LIST OF CASES.
   */
  getBins = () => {
    this.props.getUserCases(this.props.userID)
      .then((bins) => {
        const descs = {};
        bins.forEach((bin, i) => descs[bin.name] = bin.description);
        const active = {};
        bins.forEach((bin, i) => active[bin.name] = bin.active);
        const userBins = bins.map(bin => this.toTitleCase(bin.name)).sort();
        const defaultCase = (bins[0]) ? bins[0].name : '';
        this.setState({
          userBins,
          binDescs: descs,
          binActives: active,
          case: defaultCase,
        });
      });
  }

  getInactiveCases() {
    this.props.getUserInactiveCasesCount(this.props.userID)
      .then((bins) => {
        this.setState({ inactiveBinNumbers: bins });
      });
  }

  getActiveCases() {
    this.props.getUserActiveCasesCount(this.props.userID)
      .then((bins) => {
        this.setState({ activeBinNumbers: (bins - 2) });
      });
  }

  getTrashValue() {
    let trashValue = -1;
    this.state.userBins.forEach((option, index) => {
      if (option === 'Trash') {
        trashValue = index;
      }
    });
    return trashValue;
  }

  getReadValue() {
    let readValue = -1;
    this.state.userBins.forEach((option, index) => {
      if (option === 'Read') {
        readValue = index;
      }
    });
    return readValue;
  }

  /**
   * Changes the first letter of any word in a string to be capital
   * BEING REUSED IN ReportListing.jsx NEED TO DEAL WITH THIS LATER ! DUPLICATE METHODS
   */
  toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  /**
   * Handler for drop down menu item click
   */
  handleCaseClick = (event, index) => {
    this.setState({
      case: this.state.userBins[index].toLowerCase(),
    });
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleActiveChange = name => (event, checked) => {
    const newActives = Object.assign({}, this.state.binActives);
    newActives[name] = checked;
    this.props.archiveCase(name, checked, this.props.userID)
      .then(() => {
        this.getInactiveCases();
        this.getActiveCases();
      });
    this.setState({ binActives: newActives });
  };

  TabContainer = props => (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  )

  render() {
    const { value } = this.state;
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="row">
            <div className="col-sm-12">
              <h2>Dashboard</h2>
            </div>
            <div className="col-sm-9">
              <Paper elevation={2} className={`${this.props.classes.paper}`} >
                <div className={`${this.props.classes.root}`}>
                  <AppBar position="static" color="default">
                    <Tabs
                      value={value}
                      onChange={this.handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      scrollable
                      scrollButtons="auto"
                    >
                      {this.state.userBins.map((option, index) => (
                        <Tab label={option} value={index} key={index} onClick={event => this.handleCaseClick(event, index)} />
                      ))}
                    </Tabs>
                  </AppBar>
                  {this.state.userBins.map((option, index) => {
                    if (value === index) {
                      return (
                        <TabContainer key={index}>
                          <div className="col-sm-12">
                            <h3>Case Description:</h3>
                            <div className={`${this.props.classes.paper}`}>
                              <p>{this.state.binDescs[this.state.case]}</p>
                            </div>
                          </div>
                          <div className="col-sm-4">
                            <h3>Case Name:</h3>
                            <div className={`${this.props.classes.paper}`}>
                              {option}
                            </div>
                          </div>
                          {
                            (this.state.value === this.getTrashValue() || this.state.value === this.getReadValue()) ?
                              <div className="col-sm-8">
                                <h3>Report Count:</h3>
                                <div className={`${this.props.classes.paper}`}>
                                  <p># of reports in bin</p>
                                </div>
                              </div>
                            :
                              <div>
                                <div className="col-sm-4">
                                  <h3>Report Count:</h3>
                                  <div className={`${this.props.classes.paper}`}>
                                    <p># of reports in bin</p>
                                  </div>
                                </div>
                                <div className="col-sm-4">
                                  <h3>Active:</h3>
                                  <Switch
                                    checked={this.state.binActives[this.state.case]}
                                    onChange={this.handleActiveChange(this.state.case)}
                                    aria-label="checked"
                                  />
                                </div>
                              </div>
                            }

                          <div className={`${this.props.classes.reportsWrapper} col-sm-12`}>
                            <h3 style={{ marginTop: '10px' }}>Reports:</h3>
                            <div className={`${this.props.classes.paperNoPadding}`}>
                              <UserReportTable bin={this.state.case} bins={this.state.userBins} />
                            </div>
                          </div>
                          <div className={`${this.props.classes.clearfix}`} />
                        </TabContainer>
                      );
                    }
                    return null;
                  })}
                </div>
              </Paper>
            </div>
            <div className="col-sm-3">
              <Paper elevation={2} className={`${this.props.classes.paper}`} >
                <div className="col-sm-7">
                  <p>Hello {this.props.userEmail != '' ? (this.props.userEmail) : ('undefined')}!</p>
                  <p>Number of cases: {this.state.userBins.length}</p>
                </div>
                <div className="col-sm-5">
                  <img src={placeholderUserImage} className={`${this.props.classes.userimage} img-responsive`} alt="User Placeholder" />
                </div>
                <div className={`${this.props.classes.clearfix}`} />
              </Paper>
            </div>
            <p>&nbsp;</p>
            <div className="col-sm-3">
              <Paper elevation={2} className={`${this.props.classes.paper}`} >
                <div className="col-sm-12">
                  <p><strong>Number of active cases:</strong> {this.state.activeBinNumbers}</p>
                  <p><strong>Number of inactive cases:</strong> {this.state.inactiveBinNumbers}</p>
                </div>
                <div className={`${this.props.classes.clearfix}`} />
              </Paper>
            </div>
          </div>
        </div>
        {/* ====== Floating Action Button for Going to the Main Visualization ====== */}
        <div style={{ position: 'fixed', left: '20px', bottom: '20px' }} >
          <MaterialTooltip
            title="Go To Visualization"
            placement="top"
            enterDelay={50}
            classes={{
                tooltip: this.props.classes.tooltipStyle,
                popper: this.props.classes.tooltipStyle,
                }}
          >
            <Link href="/visualization" to="/visualization" >
              <Button fab style={{ margin: 12 }} color="primary">
                <img src={GoToVisualizationIcon} width="35px" height="35px" alt="Go To Visualization" />
              </Button>
            </Link>
          </MaterialTooltip>
        </div>
        {/* ====== Floating Action Button for Going to the Reports Listing ====== */}
        <div style={{ position: 'fixed', right: '20px', bottom: '20px' }} >
          <MaterialTooltip
            title="Go To Reports Listing"
            placement="top"
            enterDelay={50}
            classes={{
                tooltip: this.props.classes.tooltipStyle,
                popper: this.props.classes.tooltipStyle,
                }}
          >
            <Link href="/report" to="/report" >
              <Button fab style={{ margin: 12 }} color="primary">
                <img src={GoToReportsIcon} width="35px" height="35px" alt="Go To Reports Listing" />
              </Button>
            </Link>
          </MaterialTooltip>
        </div>
      </MuiThemeProvider>
    );
  }
}
const mapStateToProps = state => ({
  isLoggedIn: state.user.isLoggedIn,
  userEmail: state.user.userEmail,
  userID: state.user.userID,
});
export default connect(
  mapStateToProps,
  {
    getUserCases, archiveCase, getUserInactiveCasesCount, getUserActiveCasesCount,
  },
)(withStyles(styles)(Dashboard));
