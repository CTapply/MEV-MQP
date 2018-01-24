import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
// import Typography from 'material-ui/Typography';

const styles = {
  toolTipStyle: {
    'font-size': '10pt',
    padding: '5px',
    'background-color': 'rgba(75,75,75,0.85)',
    overflow: 'hidden',
    // border: '1px solid rgba(102,102,102,1)',
    color: 'rgba(255,255,255,1)',
    'text-overflow': 'ellipsis',
    // background: '#f4f4f4',
    '-webkit-box-shadow': '2px 5px 5px 0 rgba(0,0,0,0.3)',
    'box-shadow': '2px 5px 5px 0 rgba(0,0,0,0.3)',
    'text-shadow': '1px 1px 1px rgba(0,0,0,0.2)',
    'z-index': '10000',
  },
  toolTipParagraph: {
    margin: '0px',
  },
};

/**
 * This is the component that displays the Tooltip for the Timeline visualizations
 */
class CustomTooltip extends Component {
  static propTypes = {
    demographic: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    labelFormatter: PropTypes.func.isRequired,
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

  itemCodes = {
    serious: 'Serious Outcomes',
    not_serious: 'Not Serious Outcomes',
  }

  /**
   * Calculates the total amount of reports for this position
   */
  calculateTotal = payload =>
    Object.keys(payload).reduce((acc, key) => (
      (key !== this.props.demographic) ? acc + payload[key] : acc), 0)

  renderTooltipTitle = () => {
    const payload = this.props.payload[0].payload;
    return (
      <b>{this.props.labelFormatter(payload[this.props.demographic])}</b>
    );
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
        <p className={this.props.classes.toolTipParagraph}>
          Total Count: {this.calculateTotal(payload)}
        </p>
        {Object.keys(payload).map(key => ((key !== this.props.demographic)
          ? (
            <p
              className={this.props.classes.toolTipParagraph}
              key={key}
            >
              {this.itemCodes[key]}: {payload[key]}
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
