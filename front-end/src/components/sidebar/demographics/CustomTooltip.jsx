import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
// import Typography from 'material-ui/Typography';

const styles = {
  toolTipStyle: {
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
 * This is the component that displays the Tooltip for the Demographic visualizations
 */
class CustomTooltip extends Component {
  static propTypes = {
    demographic: PropTypes.string.isRequired,
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
    count: 'Total Count',
    DE: 'Death',
    CA: 'Congenital Anomaly',
    DS: 'Disability',
    HO: 'Hospitalization',
    LT: 'Life-Threatening',
    RI: 'Required Intervention',
    OT: 'Other Serious',
    UNK: 'Not Serious',
  }

  occupationTitleCodes = {
    MD: 'Physician',
    PH: 'Pharmacist',
    OT: 'Other Health Professional',
    LW: 'Lawyer',
    CN: 'Consumer',
    UNK: 'Unknown',
  }

  sexTitleCodes = {
    M: 'Male',
    F: 'Female',
    UNK: 'Unknown',
  }

  renderTooltipTitle = () => {
    const payload = this.props.payload[0].payload;
    switch (this.props.demographic) {
      case 'occp_cod':
        return (
          <b>{this.occupationTitleCodes[payload[this.props.demographic]]}</b>
        );
      case 'sex':
        return (
          <b>{this.sexTitleCodes[payload[this.props.demographic]]}</b>
        );
      default:
        return (
          <b>{payload[this.props.demographic]}</b>
        );
    }
  }

  renderToolTip = () => {
    let payload = {};
    if (this.props.payload[0]) {
      payload = this.props.payload[0].payload;
    }
    return (
      <div id="custom-tooltip" className={this.props.classes.toolTipStyle}>
        <p className={this.props.classes.toolTipParagraph}>
          {this.renderTooltipTitle()}
        </p>
        {Object.keys(payload).map(key => ((key !== this.props.demographic && key !== 'serious')
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
