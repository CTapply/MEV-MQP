import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import ReportTable from './components/ReportTable';
import MEVColors from '../../theme';
import { getUserBins, createUserBin } from '../../actions/reportActions';
import TextField from 'material-ui/TextField';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Menu, { MenuItem } from 'material-ui/Menu';
import Snackbar from 'material-ui/Snackbar';
import Paper from 'material-ui/Paper';
import Fade from 'material-ui/transitions/Fade';

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

const styles = theme => ({});

class ReportList extends Component {
  constructor() {
    super();
    this.state = {
      primaryid: '',
      bin: 'all reports',
      userBins: [],
      anchorEl: null,
      selectedIndex: 0,
      open: false,
    };
  }

  componentDidMount() {
    this.getBins();
  }

  getBins = () => {
    this.props.getUserBins(this.props.userID)
      .then(bins => this.setState({
        userBins: ['All Reports'].concat(bins.map(bin => this.toTitleCase(bin.name))),
      }));
  }

  toTitleCase = str => str.replace(/\w\S*/g, (txt) => { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); })

  handleClickListItem = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  }

  handleMenuItemClick = (event, index) => {
    this.setState({ selectedIndex: index, bin: this.state.userBins[index].toLowerCase(), anchorEl: null });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleInvalidCase = () => {
    this.setState({ open: false });
  };

  handleNewCaseClick = () => {
    const binName = document.getElementById('newBinCreator').value.toLowerCase().trim();
    console.log(this.state.userBins);
    if (binName !== '' && !this.state.userBins.map(bin => bin.toLowerCase()).includes(binName)) {
      this.setState({ userBins: this.state.userBins.concat(this.toTitleCase(binName)) });
      console.log(this.state.userBins);
      this.props.createUserBin(this.props.userID, binName);
    } else {
      this.setState({ open: true });
    }
  }

  handleNormalClick = () => {
    this.setState({ bin: '' });
  }

  handleBinClick = bin => () => {
    this.setState({ bin: bin.name });
  }

  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className="ReportList">
          <Paper elevation={15} className="ppaaaper" >
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
          </Paper>
          <ReportTable bin={this.state.bin} bins={this.state.userBins} />
          <Paper elevation={1} className="ppaaaper" >
            <TextField label="Create New Case" placeholder="New" id="newBinCreator" style={{ margin: 12 }} />
            <Button raised onClick={this.handleNewCaseClick} style={{ margin: 12 }} className="cal-button" color="primary">Create Case!</Button>
          </Paper>
          <Link to="/"><Button raised style={{ margin: 12 }} className="cal-button" color="primary">Go Back</Button></Link>
          <Snackbar
            open={this.state.open}
            onClose={this.handleInvalidCase}
            transition={Fade}
            SnackbarContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">Invalid Case Name</span>}
          />
        </div>
      </MuiThemeProvider>
    );
  }
}
const mapStateToProps = state => ({
  meType: state.mainVisualization.meType,
  product: state.mainVisualization.product,
  stage: state.mainVisualization.stage,
  cause: state.mainVisualization.cause,
  location: state.location,
  userID: state.user.userID,
});

export default connect(
  mapStateToProps,
  { getUserBins, createUserBin },
)(withStyles(styles)(ReportList));
