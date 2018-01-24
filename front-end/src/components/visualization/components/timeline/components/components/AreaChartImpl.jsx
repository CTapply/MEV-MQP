import { AreaChart } from 'recharts';


class AreaChartImpl extends AreaChart {
  constructor(props) {
    super(props);
    console.log('hi');
  }

  componentDidMount() {
    // this.getCursorRectangle() {
    //   const { layout } = this.props;
    //   const { activeCoordinate, offset, tooltipAxisBandSize } = this.state;
    //   const halfSize = tooltipAxisBandSize / 2;

    //   return {
    //     stroke: 'none',
    //     fill: '#ccc',
    //     x: layout === 'horizontal' ? activeCoordinate.x - halfSize : offset.left + 0.5,
    //     y: layout === 'horizontal' ? offset.top + 0.5 : activeCoordinate.y - halfSize,
    //     width: layout === 'horizontal' ? tooltipAxisBandSize : offset.width - 1,
    //     height: layout === 'horizontal' ? offset.height - 1 : tooltipAxisBandSize,
    //   };
    // }
  }
}

export default AreaChartImpl;
