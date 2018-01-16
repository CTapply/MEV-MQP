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
      bin: '',
      userBins: [],
    };
  }

  componentDidMount() {
    this.getBins();
  }

  getBins = () => {
    this.props.getUserBins(this.props.userID).then((bins) => this.setState({ userBins: bins }));
    console.log('this is the state now: ', this.state.userBins);
  }

  handleNewCaseClick = () => {
    const binName = document.getElementById('newBinCreator').value.toLowerCase();
    if (binName !== "" && !this.state.userBins.map(bin => {return bin.name}).includes(binName)) {
      this.setState({ userBins: this.state.userBins.concat( {name: binName}) })
      this.props.createUserBin(this.props.userID, binName);
    }
  }

  handleNormalClick = () => {
    this.setState({ bin: '' });
  }
  
  handleBinClick = (bin) => () => {
    this.setState({ bin: bin.name });
  }

  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className="ReportList">
          <h1> {`Currently inside case: ${this.state.bin === '' ? 'all' : this.state.bin} `} </h1>
          <ReportTable bin={this.state.bin} />
          <Link to="/"><Button raised style={{ margin: 12 }} className="cal-button" color="primary">Go Back</Button></Link>
          <Button raised onClick={this.handleNormalClick} style={{ margin: 12 }} className="cal-button" color="primary">Normal View</Button>
          {this.state.userBins.map(bin => {
            return <Button raised onClick={this.handleBinClick(bin)} style={{ margin: 12 }} className="cal-button" color="primary">{bin.name} Case</Button>
          })}
          <br/>
          <TextField label="Create New Case" placeholder="New" id="newBinCreator" style={{ margin: 12 }} />
          <Button raised onClick={this.handleNewCaseClick} style={{ margin: 12 }} className="cal-button" color="primary">Create Case!</Button>
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
