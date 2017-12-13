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
      bin: '',
    };
  }

  handleNormalClick = () => {
    this.setState({ bin: '' });
  }
  
  handleTrashClick = () => {
    this.setState({ bin: 'trash' });
  }

  render() {
    return (
      <MuiThemeProvider theme={defaultTheme} >
        <div className="ReportList">
          <h1> {`Currently inside bin: ${this.state.bin}`} </h1>
          <ReportTable bin={this.state.bin} />
          <Link to="/"><Button raised style={{ margin: 12 }} className="cal-button" color="primary">Go Back</Button></Link>
          <Button raised onClick={this.handleNormalClick} style={{ margin: 12 }} className="cal-button" color="primary">Normal View</Button>
          <Button raised onClick={this.handleTrashClick} style={{ margin: 12 }} className="cal-button" color="primary">Trash Bin</Button>
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
