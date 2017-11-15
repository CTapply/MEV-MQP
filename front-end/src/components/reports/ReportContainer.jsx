import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import ReportTable from './ReportTable.jsx';
import styles from '../ReportContainerStyles';

class ReportContainer extends Component {
  static propTypes = {
    classes: PropTypes.shape({
    }).isRequired,
  }

  asd = () => 123;

  render = () => (
    <div className="report-container">
      <ReportTable />
    </div>
  )
}

export default withStyles(styles)(ReportContainer);
