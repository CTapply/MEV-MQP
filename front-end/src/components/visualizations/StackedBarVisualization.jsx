import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import './StackedBarVisualization.css';

class StackedBarVisualization extends Component {
  static propTypes = {
    things: PropTypes.string,
  }

  static defaultProps = {
    things: '',
  }

  render = () => (
    <div id="main-visualization" >
      this is a visualization
    </div>
  )
}

const mapStateToProps = state => ({
  things: state.data.things,
});

export default connect(
  mapStateToProps,
  null,
)(StackedBarVisualization);
