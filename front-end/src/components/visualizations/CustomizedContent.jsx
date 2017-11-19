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
  }

  render = () => {
    // console.log(this.props)
    return (!isNaN(this.props.width) && !isNaN(this.props.height)) ? (
      <g id={this.props.id}>
        <rect
          x={this.props.x}
          y={this.props.y}
          width={this.props.width}
          height={this.props.height}
          style={{
            fill: this.props.colors[this.props.index],
            stroke: '#fff',
            strokeWidth: 1,
            strokeOpacity: 1,
          }}
        />
        {
          (this.props.depth === 1) ?
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
