import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router';
import { Link } from 'react-router-dom';

class ReportApp extends Component {
    data = data => (
      JSON.stringify(data)
    );

    render = () => (
      <div>
        {this.data(this.props.meType)} <br />
        <Link to="/">Go Back</Link>
      </div>
    );
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
)(ReportApp);
