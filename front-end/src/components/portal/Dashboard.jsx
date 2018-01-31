import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import Paper from 'material-ui/Paper';
import AppBar from 'material-ui/AppBar';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import MEVColors from '../../theme';
import placeholderUserImage from './images/user_img.png';
import ReportTable from '../reports/components/ReportTable';
import UserReportTable from './userComponents/UserReportTable';
import styles from './DashboardStyles.js';

import { getUserBins } from '../../actions/reportActions';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ 
      padding: '15px',
      'boxShadow': '0px 1px 5px 0px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 3px 1px -2px rgba(0, 0, 0, 0.12)',
      border: '3px solid ##f5f5f5',}}>
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
 * This is the component for the App
 */
class Dashboard extends Component {
  static propTypes = {
    getUserBins: PropTypes.func.isRequired,
    classes: PropTypes.shape({
    }).isRequired,
  }

  constructor(){
    super();
    this.state = {
      userBins: [],
      value: 0,
      case: '',
    };
  }

  asd = () => 123;
  componentDidMount() {
    this.getBins();
    this.setState({ value: 0 });
  }
  
  /**
   * Retrieves the names of the bins the user has created
   * ALSO ALPHABETIZES THE LIST OF CASES.
   */
  getBins = () => {
    this.props.getUserBins(this.props.userID)
      .then(bins => this.setState({
        userBins: bins.map(bin => this.toTitleCase(bin.name)).sort(),
      }));
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
    console.log("case clicked:", this.state.case);
  };
 
  TabContainer = (props) => {
    return (
      <Typography component="div" style={{ padding: 8 * 3 }}>
        {props.children}
      </Typography>
    );
  }

  render() {
    const { classes } = this.props;
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
                 <div className={`col-sm-4`}>
                 <h3>Case Name:</h3>
                  <div className={`${this.props.classes.paper}`}>
                    {option}
                  </div>
                 </div>
                 <div className={`col-sm-4`}>
                 <h3>Report Count:</h3>
                  <div className={`${this.props.classes.paper}`}>
                    <p># of reports in bin</p>
                  </div>
                 </div>
                 <div className={`${this.props.classes.reportsWrapper} col-sm-12`}>
                 <h3 style={{ marginTop: '10px' }}>Reports:</h3>
                 <div className={`${this.props.classes.paperNoPadding}`}>
                  <UserReportTable bin={this.state.case} bins={this.state.userBins} />
                  </div>
                 </div>
                 <div className={`${this.props.classes.clearfix}`}></div>
                </TabContainer>
                )
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
                  <img src={placeholderUserImage} className={`${this.props.classes.userimage} img-responsive`}/>
                </div>
                <div className={`${this.props.classes.clearfix}`}></div>
              </Paper>
            </div>
          </div>
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
  { getUserBins },
)(withStyles(styles)(Dashboard));
