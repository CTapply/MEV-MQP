import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import styles from '../FilterContainerStyles';

class FilterContainer extends Component {
  static propTypes = {
    classes: PropTypes.shape({
    }).isRequired,
  }

  asd = () => 123;

  render = () => (
    <div className="filter-container">
    </div>
  )
}

export default withStyles(styles)(FilterContainer);
