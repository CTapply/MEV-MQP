import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';

const styles = {};

class CaseSummary extends Component {
  static propTypes = {
    caseID: PropTypes.number,
    userID: PropTypes.number.isRequired,
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string,
      }),
    }),
  }

  static defaultProps = {
    caseID: null,
    match: {
      params: {
        id: null,
      },
    },
  }

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentWillMount() {
    // grab case data here and throw that in the state
  }

  render() {
    return (
      <div>
        <p> Case Details </p>
        <p> Case ID: {Number(this.props.caseID, 10)} </p>
        <p> User ID: {Number(this.props.userID, 10)} </p>
        <p> URL PARAM: {Number(this.props.match.params.id, 10)} </p>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  userID: state.user.userID,
});

/**
 * Conect this component to the Redux global State.
 * Maps Redux state to this comonent's props.
 * Gets Redux actions to be called in this component.
 * Exports this component with the proper JSS styles.
 */
export default connect(
  mapStateToProps,
  null,
)(withStyles(styles)(CaseSummary));

