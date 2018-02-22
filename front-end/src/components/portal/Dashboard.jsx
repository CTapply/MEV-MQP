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
    isLoggedIn: PropTypes.bool.isRequired,
    classes: PropTypes.shape({
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
    };
  }

  componentWillMount() {
    this.getBins();
  }

  componentDidMount() {
    if (!this.props.isLoggedIn) {
      window.location = '/';
    }
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
        console.log(active);
        this.setState({
          userBins,
          binDescs: descs,
          binActives: active,
          case: defaultCase,
        });
      });
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
    this.props.archiveCase(name, checked, this.props.userID);
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
        <div className="About container">
          <div className="row">
            <div className="col-sm-12">
              <h2>Dashboard</h2>
            </div>
            <div className="col-sm-8">
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
                     <div className="col-sm-4">
                       <h3>Report Count:</h3>
                       <div className={`${this.props.classes.paper}`}>
                         <p># of reports in bin</p>
                       </div>
                     </div>
                     <div className="col-sm-4">
                       <h3>Active:</h3>
                       {console.log(this.state.binActives)}
                       <Switch
                         checked={this.state.binActives[this.state.case]}
                         onChange={this.handleActiveChange(this.state.case)}
                         aria-label="checked"
                       />
                     </div>
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
            })}
                </div>
              </Paper>
            </div>
            <div className="col-sm-4">
              <Paper elevation={2} className={`${this.props.classes.paper}`} >
                <div className="col-xs-7">
                  <p>Hello {this.props.userEmail != '' ? (this.props.userEmail) : ('undefined')}!</p>
                  <p>Number of cases: {this.state.userBins.length}</p>
                </div>
                <div className="col-xs-5">
                  <img src={placeholderUserImage} className={`${this.props.classes.userimage} img-responsive`} />
                </div>
                <div className={`${this.props.classes.clearfix}`} />
              </Paper>
            </div>
          </div>
        </div>
        {/* ====== Floating Action Button for Going back to Main Visualization ====== */}
        <div style={{ position: 'fixed', left: '20px', bottom: '20px' }} >
          <MaterialTooltip
            title="Go Back To Visualization"
            placement="top"
            enterDelay={50}
            classes={{
                tooltip: this.props.classes.tooltipStyle,
                popper: this.props.classes.tooltipStyle,
                }}
          >
            <Link href="/visualization" to="/visualization" >
                <Button fab style={{ margin: 12 }} color="primary">
                  <img src={GoToVisualizationIcon} className={this.props.classes.goToVisualizationSVG} width="35px" height="35px" alt="Go Back To Visualization" />
                </Button>
              </Link>
          </MaterialTooltip>
        </div>
        {/* ====== Floating Action Button for Going back to Main Visualization ====== */}
        <div style={{ position: 'fixed', right: '20px', bottom: '20px' }} >
          <MaterialTooltip
            title="Go to reports"
            placement="top"
            enterDelay={50}
            classes={{
                tooltip: this.props.classes.tooltipStyle,
                popper: this.props.classes.tooltipStyle,
                }}
          >
            <Link href="/report" to="/report" >
                <Button fab style={{ margin: 12 }} color="primary">
                  <img src={GoToReportsIcon} className={this.props.classes.goToVisualizationSVG} width="35px" height="35px" alt="Go Back To Visualization" />
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
  { getUserCases, archiveCase },
)(withStyles(styles)(Dashboard));
