import React, { Component } from 'react';
import MEVColors from '../../../../../theme';

class CustomizedContent extends Component {
  static defaultProps = {
    id: null,
    root: null,
    depth: null,
    x: null,
    y: null,
    width: null,
    height: null,
    index: null,
    payload: null,
    colors: null,
    rank: null,
    name: null,
    highestSeriousCount: 0,
    size: 0,
    UNK: 0,
  }

  getFillColor = () => {
    // const numberSerious = this.props.size - this.props.UNK;
    // const percent = Math.min(numberSerious / this.props.highestSeriousCount, 1);
    const percent = Math.min(1 - (this.props.UNK / Math.max(this.props.size, 1)), 1);
    return this.getColorAtPercent(percent);
  }

  getColorAtPercent = (percent) => {
    // const orange = 'F57C00';
    // const yellow = 'D8B400';
    // const blue = '283593';

    const severe = MEVColors.severeLight.slice(1);
    const mid = MEVColors.middleOfGradient.slice(1);
    const notSevere = MEVColors.notSevereLight.slice(1);
    let color1;
    let color2;

    if (mid !== '') {
      if (percent <= 0.5) {
        color1 = severe;
        color2 = mid;
        percent = (1 - (percent * 2));
      } else {
        color1 = mid;
        color2 = notSevere;
        percent = (1 - (percent - 0.5)) * 2;
      }
    } else {
      color1 = severe;
      color2 = notSevere;
    }

    const r = Math.ceil(parseInt(color1.substring(0, 2), 16) * percent + parseInt(color2.substring(0, 2), 16) * (1-percent));
    const g = Math.ceil(parseInt(color1.substring(2, 4), 16) * percent + parseInt(color2.substring(2, 4), 16) * (1-percent));
    const b = Math.ceil(parseInt(color1.substring(4, 6), 16) * percent + parseInt(color2.substring(4, 6), 16) * (1-percent));

    const rDark = Math.ceil((parseInt(color1.substring(0, 2), 16) * percent + parseInt(color2.substring(0, 2), 16) * (1-percent)) * 0.75);
    const gDark = Math.ceil((parseInt(color1.substring(2, 4), 16) * percent + parseInt(color2.substring(2, 4), 16) * (1-percent)) * 0.75);
    const bDark = Math.ceil((parseInt(color1.substring(4, 6), 16) * percent + parseInt(color2.substring(4, 6), 16) * (1-percent)) * 0.75);

    return {
      lightColor: this.fixHex(r) + this.fixHex(g) + this.fixHex(b),
      darkColor: this.fixHex(rDark) + this.fixHex(gDark) + this.fixHex(bDark),
    };
  }

  fixHex = (x) => {
    x = x.toString(16);
    return (x.length === 1) ? `0${x}` : x;
  }

  checkTextLength = () => {
    if (this.props.name) {
      const textLength = this.props.name.length;
      if (textLength * 8.0 > this.props.width) {
        return false;
      }
      return true;
    }
    return false;
  }

  render = () => {
    return (!isNaN(this.props.width) && !isNaN(this.props.height)) ? (
      <g id={`${this.props.treeMap}_${this.props.name}`} >
        <defs>
          <linearGradient id={this.props.size} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="15%" stopColor={`#${this.getFillColor().lightColor}`} stopOpacity={1} />
            <stop offset="99%" stopColor={`#${this.getFillColor().darkColor}`} stopOpacity={1} />
          </linearGradient>
        </defs>
        <rect
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          style={{
            fill: `url(#${this.props.size})`,
            stroke: '#fff',
            strokeWidth: 0.5,
            strokeOpacity: 1,
            overflow: 'hidden',
          }}
        />
        {(this.checkTextLength())
          ? (
            <text
              x={this.props.x + this.props.width / 2}
              y={this.props.y + this.props.height / 2 + 7}
              textAnchor="middle"
              style={{ fill: '#FFF', strokeWidth: '0px' }}
              fontFamily="Roboto"
              fontWeight="lighter"
              fontSize={16}
            >
              {this.props.name}
            </text>)
          : null}
      </g>
    ) : null;
  }
}

export default CustomizedContent;
