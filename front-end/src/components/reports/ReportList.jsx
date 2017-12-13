import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import ReportTable from './components/ReportTable';
import MEVColors from '../../theme';

const defaultTheme = createMuiTheme({
  palette: {
    primary: {
      ...blue,
      500: MEVColors.buttonLight,
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
      bin: 'all',
    };
  }

  handleAllClick = () => {
    this.setState({ bin: 'all' });
  }

  handleImportantClick = () => {
    this.setState({ bin: 'important' });
  }

  handleUnimportantClick = () => {
    this.setState({ bin: 'unimportant' });
  }

  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className="ReportList">
          <h1> {`Currently inside bin: ${this.state.bin}`} </h1>
          <ReportTable bin={this.state.bin} />
          <Link to="/"><Button raised style={{ margin: 12 }} className="cal-button" color="primary">Go Back</Button></Link>
          <Button raised onClick={this.handleAllClick} style={{ margin: 12 }} className="cal-button" color="primary">All Bin</Button>
          <Button raised onClick={this.handleImportantClick} style={{ margin: 12 }} className="cal-button" color="primary">Important Bin</Button>
          <Button raised onClick={this.handleUnimportantClick} style={{ margin: 12 }} className="cal-button" color="primary">Unimportant Bin</Button>
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
});

export default connect(
  mapStateToProps,
  null,
)(withStyles(styles)(ReportList));
