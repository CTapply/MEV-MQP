import React, { Component } from 'react';

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
    highestSeriousCount: 1,
    size: 0,
    UNK: 0,
  }

  getFillColor = () => {
    // const numberSerious = this.props.size - this.props.UNK;
    // const percent = Math.min(numberSerious / this.props.highestSeriousCount, 1);
    const percent = Math.min(1 - (this.props.UNK / (this.props.size + 1)), 1);
    return this.getColorAtPercent(percent);
  }

  getColorAtPercent = (percent) => {
    const orange = 'F57C00';
    const yellow = 'D8B400';
    const blue = '283593';

    // let color1 = orange;
    // let color2 = blue;
    let color1;
    let color2;

    if (percent <= 0.5) {
      color1 = yellow;
      color2 = blue;
    } else {
      color1 = orange;
      color2 = yellow;
    }

    const r = Math.ceil(parseInt(color1.substring(0, 2), 16) * percent + parseInt(color2.substring(0, 2), 16) * (1-percent));
    const g = Math.ceil(parseInt(color1.substring(2, 4), 16) * percent + parseInt(color2.substring(2, 4), 16) * (1-percent));
    const b = Math.ceil(parseInt(color1.substring(4, 6), 16) * percent + parseInt(color2.substring(4, 6), 16) * (1-percent));

    return this.fixHex(r) + this.fixHex(g) + this.fixHex(b);
  }

  fixHex = (x) => {
    x = x.toString(16);
    return (x.length === 1) ? `0${x}` : x;
  }

  render = () => {
    return (!isNaN(this.props.width) && !isNaN(this.props.height)) ? (
      <g id={this.props.id} >
        <rect
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          style={{
            fill: `#${this.getFillColor()}`,
            stroke: '#fff',
            strokeWidth: 1,
            strokeOpacity: 1,
          }}
        />
        {
          (this.props.depth === 1 && false) ?
            <text
              x={this.props.x + this.props.width / 2}
              y={this.props.y + this.props.height / 2 + 7}
              textAnchor="middle"
              style={{ fill: '#fff' }}
              fontFamily="Roboto"
              fontWeight="lighter"
              fontSize={14}
            >
              {this.props.name}
            </text>
            : null
        }
      </g>
    ) : null;
  }
}

export default CustomizedContent;
