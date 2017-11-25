import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';
import Button from 'material-ui/Button';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme, withStyles } from 'material-ui/styles';
import { blue, green, red } from 'material-ui/colors';
import ReportContainer from './reports/ReportContainer';

const blueTheme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      ...green,
      A400: '#00e677',
    },
    error: red,
  },
});

const styles = theme => ({});

class ReportView extends Component {
  asd = () => 123;

  render() {
    return (
      <MuiThemeProvider theme={blueTheme} >
        <div className="ReportView">
          <ReportContainer />
          <Link to="/"><Button raised className="cal-button" color="primary">Go Back</Button></Link>
          <br />
          <br />
          <Link to="/pdf" target="_blank"><Button raised className="cal-button" color="primary">Open a PDF view</Button></Link>
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
)(withStyles(styles)(ReportView));
