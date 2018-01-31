import React, { Component } from 'react';
import { withStyles } from 'material-ui/styles';

const styles = {};

class CaseSummary extends Component {
  static propTypes = {
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
        <h1> Gorgeous Case Deets </h1>
        <h2> {Number(this.props.match.params.id, 10)} </h2>
      </div>
    );
  }
}

export default withStyles(styles)(CaseSummary);

