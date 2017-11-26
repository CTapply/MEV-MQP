import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
// import Typography from 'material-ui/Typography';

const styles = {
  toolTipStyle: {
    'font-size': '10pt',
    padding: '5px',
    'background-color': 'white',
    overflow: 'hidden',
    border: '1px solid rgba(102,102,102,1)',
    color: 'rgba(0,0,0,1)',
    'text-overflow': 'ellipsis',
    background: '#f4f4f4',
    '-webkit-box-shadow': '1px 1px 1px 0 rgba(0,0,0,0.3)',
    'box-shadow': '1px 1px 1px 0 rgba(0,0,0,0.3)',
    'text-shadow': '1px 1px 1px rgba(0,0,0,0.2)',
    'z-index': '10000',
  },
  toolTipParagraph: {
    margin: '0px',
  },
};

/**
 * This is the component that displays the Tooltip for the TreeMap visualizations
 */
class CustomTooltip extends Component {
  static propTypes = {
    active: PropTypes.bool.isRequired,
    payload: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.shape({
      toolTipStyle: PropTypes.string,
      toolTipParagraph: PropTypes.string,
    }).isRequired,
  }

  static defaultProps = {
    payload: [],
  }

  outcomeCodes = {
    size: 'Total Count',
    DE: 'Death',
    CA: 'Congenital Anomaly',
    DS: 'Disability',
    HO: 'Hospitalization',
    LT: 'Life-Threatening',
    RI: 'Required Intervention',
    OT: 'Other Serious',
    UNK: 'Not Serious',
  }

  renderToolTip = () => {
    let payload = {};
    if (this.props.payload[0]) {
      payload = this.props.payload[0].payload;
    }
    return (
      <div id="custom-tooltip" className={this.props.classes.toolTipStyle}>
        <p className={this.props.classes.toolTipParagraph}>
          <b>{payload.name}</b>
        </p>
        {Object.keys(payload).map(key => (
          (Object.keys(this.outcomeCodes).includes(key) && payload[key])
            ? (
              <p
                className={this.props.classes.toolTipParagraph}
                key={key}
              >
                {this.outcomeCodes[key]}: {payload[key]}
              </p>
            )
            : null
        ))}
      </div>
    );
  }

  render() {
    return (this.props.active && this.props.payload)
      ? this.renderToolTip()
      : null;
  }
}

export default withStyles(styles)(CustomTooltip);
