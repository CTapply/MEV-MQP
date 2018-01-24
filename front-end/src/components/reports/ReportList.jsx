import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Fade from 'material-ui/transitions/Fade';
import ReportTable from './components/ReportTable';
import MEVColors from '../../theme';
import { getUserBins, createUserBin } from '../../actions/reportActions';

const styles = {};

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
    getUserBins: PropTypes.func.isRequired,
    createUserBin: PropTypes.func.isRequired,
    userID: PropTypes.number.isRequired,
  }

  constructor() {
    super();
    this.state = {
      bin: 'all reports',
      userBins: [],
      anchorEl: null,
      selectedIndex: 0,
      open: false,
      value: '',
    };
  }

  componentDidMount() {
    this.getBins();
  }

  /**
   * Retrieves the names of the bins the user has created
   */
  getBins = () => {
    this.props.getUserBins(this.props.userID)
      .then(bins => this.setState({
        userBins: ['All Reports'].concat(bins.map(bin => this.toTitleCase(bin.name))),
      }));
  }

  /**
   * Changes the first letter of any word in a string to be capital
   */
  toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());

  /**
   * Handler for drop down menu click
   */
  handleClickListItem = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  /**
   * Handler for drop down menu item click
   */
  handleMenuItemClick = (event, index) => {
    this.setState({
      selectedIndex: index,
      bin: this.state.userBins[index].toLowerCase(),
      anchorEl: null,
    });
  };

  /**
   * Handler for drop down menu closing
   */
  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  /**
   * Handler for invalid case name input during case creation
   */
  handleInvalidCase = () => {
    this.setState({ open: false });
  };

  /**
   * Checks name validity of new bin and shows an error or sends a backend fetch request
   */
  handleNewCaseClick = () => {
    const binName = document.getElementById('newBinCreator').value.toLowerCase().trim();
    if (binName !== '' && !this.state.userBins.map(bin => bin.toLowerCase()).includes(binName)) {
      this.setState({ userBins: this.state.userBins.concat(this.toTitleCase(binName)) });
      this.props.createUserBin(this.props.userID, binName);
      document.getElementById('newBinCreator').value = '';
      this.setState({ open: true, value: `Case ${this.toTitleCase(binName)} Created!` });
    } else {
      this.setState({ open: true, value: 'Invalid Case Name' });
    }
  }

  /**
   * Sets the currently open bin
   */
  handleBinClick = bin => () => {
    this.setState({ bin: bin.name });
  }

  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className="ReportList">
          <Paper elevation={2} className="paper" >
            <List>
              <ListItem
                button
                aria-haspopup="true"
                aria-controls="lock-menu"
                aria-label="Select a Case"
                onClick={this.handleClickListItem}
              >
                <ListItemText
                  primary={this.state.userBins[this.state.selectedIndex]}
                  secondary="Select a Case"
                />
              </ListItem>
            </List>
            <Menu
              id="lock-menu"
              anchorEl={this.state.anchorEl}
              open={Boolean(this.state.anchorEl)}
              onClose={this.handleClose}
            >
              {this.state.userBins.map((option, index) => (
                <MenuItem
                  key={option}
                  selected={index === this.state.selectedIndex}
                  onClick={event => this.handleMenuItemClick(event, index)}
                >
                  {option}
                </MenuItem>
              ))}
            </Menu>
          </Paper >
          <hr />
          <ReportTable bin={this.state.bin} bins={this.state.userBins} />
          <Paper elevation={2} className="ppaaaper" >
            <TextField label="Create New Case" placeholder="New" id="newBinCreator" style={{ margin: 12 }} />
            <Button raised onClick={this.handleNewCaseClick} style={{ margin: 12 }} className="cal-button" color="primary">Create Case!</Button>
          </Paper>
          <Link href="/" to="/" > <Button raised style={{ margin: 12 }} className="cal-button" color="primary">Go Back</Button></Link>
          <Snackbar
            open={this.state.open}
            onClose={this.handleInvalidCase}
            transition={Fade}
            SnackbarContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.value}</span>}
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
  { getUserBins, createUserBin },
)(withStyles(styles)(ReportList));
