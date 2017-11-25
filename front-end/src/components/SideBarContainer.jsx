import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import SideBar from './sidebar/SideBar';
import styles from './SideBarContainerStyles';

class SideBarContainer extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      sideBar: PropTypes.string,
    }).isRequired,
  }

  asd = () => 123;

  render = () => (
    <div className={this.props.classes.sideBar} >
      <SideBar />
    </div>
  )
}

export default withStyles(styles)(SideBarContainer);
