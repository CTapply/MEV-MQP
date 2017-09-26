import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from 'react-bootstrap';
import Demograpics from './Demographics';
import { getData } from '../../actions/visualizationAction';
import './SideBar.css';

class SideBar extends Component {
  static propTypes = {
    getData: PropTypes.func.isRequired,
  }

  asd = () => 2;

  render = () => (
    <div id="sidebar" >
      {/* <SelectedDate /> */}
      <Button bsStyle="primary" onClick={this.props.getData}>CLICK ME</Button>
      <Demograpics />
    </div>
  )
}

export default connect(
  null,
  { getData },
)(SideBar);
